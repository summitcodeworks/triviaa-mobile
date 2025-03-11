import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { theme } from './src/constants/theme';
import type { RootStackParamList, TabParamList } from './src/types/navigation';
import { CoinProvider } from './src/context/CoinContext';
import CoinScreen from './src/screens/CoinScreen.tsx';
import AddCoinsScreen from './src/screens/AddCoinsScreen.tsx';
import { AppOpenAd, MobileAds } from 'react-native-google-mobile-ads';
import RecentlyPlayedScreen from './src/screens/RecentlyPlayedScreen.tsx';
import PointsScreen from './src/screens/PointsScreen.tsx';
import LoginScreen from './src/screens/LoginScreen.tsx';
import SignUpScreen from './src/screens/SignUpScreen.tsx';
import CreateUsernameScreen from './src/screens/CreateUsernameScreen.tsx';
import SettingsScreen from './src/screens/SettingsScreen.tsx';
import DontWantToEarnScreen from './src/screens/DontWantToEarnScreen.tsx';
import ThresholdLimiterScreen from './src/screens/ThresholdLimiterScreen.tsx';
import ChangeUsernameScreen from './src/screens/ChangeUsernameScreen.tsx';
import ChangeProfilePictureScreen from './src/screens/ChangeProfilePictureScreen.tsx';
import EmailVerificationScreen from './src/screens/EmailVerificationScreen.tsx';
import ReportsScreen from './src/screens/ReportsScreen.tsx';
import PrivacySettingsScreen from './src/screens/PrivacySettingsScreen.tsx';
import HelpSupportScreen from './src/screens/HelpSupportScreen.tsx';
import NotificationService from './src/service/NotificationService.ts';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import UserDetailsScreen from "./src/screens/UserDetailsScreen.tsx";
import Icon from '@react-native-vector-icons/ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAUTH_USER_KEY } from "./globals.tsx";
import { UserData } from "./src/models/UserData.ts";
import { UserStorageService } from "./src/service/user-storage.service.ts";
import { initializeGlobalUser } from './src/context/UserContext.tsx';
import ApiClient from './src/utils/apiClient.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const firebaseConfig = {
    apiKey: 'AIzaSyC1m6YjmpcCZjaZjLCllfktQSkjI6k22CY',
    authDomain: 'triviaa-14824.firebaseapp.com',
    projectId: 'triviaa-14824',
    storageBucket: 'triviaa-14824.firebasestorage.app',
    messagingSenderId: '596817273399',
    appId: '1:596817273399:web:cf9dd29c7a0ec3992d15b2',
    measurementId: 'G-G4245F1852',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function TabNavigator() {
    useEffect(() => {
        const userStorage = new UserStorageService();

        // Initialize AdMob
        MobileAds().initialize().then(adapterStatuses => {
            console.log('AdMob Initialized', adapterStatuses);
        });

        const setupNotifications = async () => {
            await initializeGlobalUser();
            const isSetup = await NotificationService.init();
            if (isSetup) {
                const unsubscribeForeground = NotificationService.onForegroundMessage();
                const unsubscribeOpenedApp = NotificationService.onNotificationOpenedApp();

                // Set up background handler
                NotificationService.onBackgroundMessage();

                return () => {
                    unsubscribeForeground();
                    unsubscribeOpenedApp();
                };
            }
        };


        setupNotifications();
    }, []);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.white,
                    borderTopWidth: 1,
                    borderTopColor: '#F0F0F0',
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Leaderboard"
                component={LeaderboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="trophy-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

interface ApiHeader {
    responseCode: number;
    responseMessage: string;
}

interface UserResponse {
    user_id: string;
    user_key: string | null;
    user_name: string;
    user_email: string | null;
    user_credits: number | null;
    user_creation_date: string;
    use_flag: boolean;
    user_photo_url: string;
    device_token: string | null;
    phone_number: string;
    password: string | null;
}

interface ApiResponse {
    header: ApiHeader;
    response: UserResponse;
}

export default function App() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);

    // Handle user state changes
    async function onAuthStateChanged(user: any) {
        try {
        
            if (user) {
                console.log('User:', user.phoneNumber + ' ' + user.uid);
                // Check if user exists in our API
                try {
                    console.log('Checking user login status:', user.uid);
                    
                    if (user.phoneNumber) {
                        const loginResponse = await ApiClient.post<ApiResponse>('/api/users/auth/phone', {
                            phoneNumber: user.phoneNumber,
                            userKey: user.uid
                        });
                        console.log('Login API Response:', JSON.stringify(loginResponse.data));
                        
                        if (loginResponse.data?.header?.responseCode === 200) {
                            setUser(user);
                        } else {
                            console.log('User not properly logged in, signing out');
                            await auth().signOut();
                            setUser(null);
                        }
                    } else {
                        console.log('User phone number not found');
                        await auth().signOut();
                        setUser(null);
                    }
                } catch (error: any) {
                    console.log('Error checking login status:', error);
                    await auth().signOut();
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } finally {
            if (initializing) setInitializing(false);
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Show nothing while initializing
    if (initializing) {
        return null;
    }


    return (
        <CoinProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                    initialRouteName={user ? 'MainTabs' : 'Welcome'}
                >
                    {/* Common screens accessible in both states */}
                    <Stack.Screen name="UserDetails" component={UserDetailsScreen} />

                    {
                        user ? (
                            <>
                                <Stack.Screen name="MainTabs" component={TabNavigator} />
                                <Stack.Screen name="Category" component={CategoryScreen} />
                                <Stack.Screen name="Quiz" component={QuizScreen} />
                                <Stack.Screen name="Result" component={ResultScreen} />
                                <Stack.Screen name="Coins" component={CoinScreen} />
                                <Stack.Screen name="AddCoins" component={AddCoinsScreen} />
                                <Stack.Screen name="RecentlyPlayed" component={RecentlyPlayedScreen} />
                                <Stack.Screen name="Points" component={PointsScreen} />
                                <Stack.Screen name="Settings" component={SettingsScreen} />
                                <Stack.Screen name="DontWantToEarn" component={DontWantToEarnScreen} />
                                <Stack.Screen name="ThresholdLimiter" component={ThresholdLimiterScreen} />
                                <Stack.Screen name="ChangeUsername" component={ChangeUsernameScreen} />
                                <Stack.Screen name="ChangeProfilePicture" component={ChangeProfilePictureScreen} />
                                <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
                                <Stack.Screen name="Reports" component={ReportsScreen} />
                                <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
                                <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
                            </>
                        ) : (
                            <>
                                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                                <Stack.Screen name="Login" component={LoginScreen} />
                                <Stack.Screen name="SignUp" component={SignUpScreen} />
                                <Stack.Screen name="CreateUsername" component={CreateUsernameScreen} />
                                <Stack.Screen name="MainTabs" component={TabNavigator} />
                                <Stack.Screen name="Settings" component={SettingsScreen} />
                            </>
                        )
                    }
                </Stack.Navigator>
            </NavigationContainer>
        </CoinProvider>
    );
}

