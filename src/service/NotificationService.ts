import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationService {
    async requestUserPermission() {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
            }

            return enabled;
        } catch (error) {
            console.log('Permission request error:', error);
            return false;
        }
    }

    async getFCMToken() {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
                console.log('FCM Token:', fcmToken);
                return fcmToken;
            }
        } catch (error) {
            console.log('Error getting FCM token:', error);
            return null;
        }
    }

    onForegroundMessage() {
        return messaging().onMessage(async remoteMessage => {
            console.log('Received foreground message:', remoteMessage);
            // You can implement your own custom notification display here
            // or use the default system notification
        });
    }

    onBackgroundMessage() {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Received background message:', remoteMessage);
            // Handle background message
        });
    }

    onNotificationOpenedApp() {
        return messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification opened app:', remoteMessage);
            if (remoteMessage.data) {
                // Handle notification tap
                this.handleNotificationData(remoteMessage.data);
            }
        });
    }

    async checkInitialNotification() {
        const remoteMessage = await messaging().getInitialNotification();
        if (remoteMessage) {
            console.log('Notification opened app from quit state:', remoteMessage);
            if (remoteMessage.data) {
                this.handleNotificationData(remoteMessage.data);
            }
        }
    }

    async handleNotificationData(data: any) {
        // Handle different types of notifications
        switch (data.type) {
            case 'message':
                // Navigate to message screen
                // navigation.navigate('Message', { id: data.messageId });
                break;
            case 'announcement':
                // Navigate to announcement screen
                // navigation.navigate('Announcement', { id: data.announcementId });
                break;
            // Add more cases as needed
        }
    }

    async init() {
        try {
            // Request permissions
            const hasPermission = await this.requestUserPermission();
            if (!hasPermission) {
                console.log('User declined notifications permission');
                return false;
            }

            // Get FCM token
            const token = await this.getFCMToken();

            // Set up token refresh handler
            messaging().onTokenRefresh(async (fcmToken) => {
                console.log('New token:', fcmToken);
                await AsyncStorage.setItem('fcmToken', fcmToken);
                // Update token on your backend here
            });

            // Check for initial notification
            await this.checkInitialNotification();

            return true;
        } catch (error) {
            console.log('Notification setup error:', error);
            return false;
        }
    }
}

export default new NotificationService();
