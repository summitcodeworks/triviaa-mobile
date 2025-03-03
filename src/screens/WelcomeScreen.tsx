import React, {useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Platform,
} from 'react-native';
import { theme } from '../constants/theme';
import type { RootStackScreenProps } from '../types/navigation';
import DeviceInfo from 'react-native-device-info';
import config from '../config';
import ApiClient from '../utils/apiClient.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from "@react-native-firebase/messaging";
import {DEVICE_TOKEN_KEY} from "../../globals.tsx";



export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {

    useEffect(() => {
        const initializeDeviceToken = async () => {
            const token = await getOrFetchDeviceToken();
            // await globals.setDeviceToken(token);
            if (token) {
                console.log('Device Token ready:', token);
                // You can now use the token for API calls or other logic
            } else {
                console.error('Failed to get or fetch device token');
            }
        };

        initializeDeviceToken();
    }, []);

    const fetchDeviceToken = async () => {
        try {
            // Request permission for notifications (iOS)
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (!enabled) {
                throw new Error('User notification permissions not granted');
            }

            // Get the token string
            const token = await messaging().getToken();
            if (!token) {
                throw new Error('Failed to get FCM token');
            }

            console.log('Device Token:', token);
            console.log('Device Token:messaging ', messaging());

            // Save the token string to AsyncStorage
            await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);

            return token;
        } catch (error) {
            console.error('Error fetching device token:', error);
            throw error;
        }
    };

    const getOrFetchDeviceToken = async () => {
        try {
            // Check if the device token already exists in AsyncStorage
            const storedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);

            if (storedToken) {
                console.log('Stored Device Token:', storedToken);
                // Verify if the stored token is still valid
                const currentToken = await messaging().getToken();
                if (currentToken !== storedToken) {
                    console.log('Stored token is outdated, fetching new token...');
                    return await fetchDeviceToken();
                }
                return storedToken;
            } else {
                // If no token exists, fetch and save a new one
                return await fetchDeviceToken();
            }
        } catch (error) {
            console.error('Error getting or fetching device token:', error);
            return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Quiz 🏆</Text>
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/quiz_illustration.jpg')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.heading}>Play To Gain Your Knowledge</Text>
                    <Text style={styles.subtitle}>
                        I'm working for now i also believe it's important for every member
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    // onPress={() => navigation.navigate('Login')}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    header: {
        marginTop: theme.spacing.xl,
    },
    title: {
        fontSize: 40,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '60%',
    },
    textContainer: {
        marginBottom: theme.spacing.xl,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

