import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { theme } from '../constants/theme';
import type { RootStackScreenProps } from '../types/navigation';
import { LoginVector } from '../components/VectorGraphics';
import { Background } from '../components/Background';
import ApiClient from '../utils/apiClient.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DEVICE_TOKEN, FAUTH_USER_KEY, gPhoneNumber} from '../../globals.tsx';
import {UserStorageService} from "../service/user-storage.service.ts";
import {UserData} from "../models/UserData.ts";

const DEVICE_TOKEN_KEY = '@fcm_token';

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

interface RegisterUserRequest {
    userName: string;
    email: string;
    password: string;
    photoUrl: string;
    phoneNumber: string;
}

export default function LoginScreen({ navigation }: RootStackScreenProps<'Login'>) {
    const userStorage = new UserStorageService();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOTPInput, setShowOTPInput] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    const handleSendCode = async () => {
        try {
            setLoading(true);
            const formattedNumber = phoneNumber.startsWith('+')
                ? phoneNumber
                : `+${phoneNumber}`;

            const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
            setVerificationId(confirmation.verificationId);
            setShowOTPInput(true);
            Alert.alert('Success', 'Verification code has been sent to your phone.');
        } catch (err) {
            console.error(err);
            Alert.alert('Error', err.message || 'Failed to send verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        try {
            setLoading(true);
            const credential = auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
            );

            const user = await auth().signInWithCredential(credential);
            console.log('User signed in:', user);
            //await registerUser(user);
            await checkPhoneExists(user);
            // navigation.replace('MainTabs');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', error.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const checkPhoneExists = async (user: any) => {
        try {
            setLoading(true);
            const deviceToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);

            const requestBody: RegisterUserRequest = {
                phoneNumber: user.phoneNumber || phoneNumber,
            };

            console.log('User login details: ' + JSON.stringify(user));

            const response = await ApiClient.post<ApiResponse>('/api/users/check-phone', requestBody);

            if (response.data.header.responseCode === 200) {
                if (response.data.response.exists) {
                    // await registerOrLoginUser(user);
                    const userData = new UserData(response.data.response);
                    userStorage.saveUser(userData);
                } else {
                    gPhoneNumber = user.phoneNumber;
                    navigation.replace('UserDetails', { phoneNumber: user.phoneNumber || phoneNumber, deviceToken: deviceToken, userKey: user.user.uid });
                }
            } else if (response.data.header.responseCode === 200) {
                throw new Error(response.data.header.responseMessage || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.header?.responseMessage || error.message || 'Failed to register user';
            Alert.alert('Error', errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const registerOrLoginUser = async (user: any) => {
        try {
            setLoading(true);
            const deviceToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);

            const requestBody: RegisterUserRequest = {
                userName: userName || user.displayName || '',
                email: email || user.email || '',
                password: password,
                photoUrl: photoUrl || user.photoURL || '',
                phoneNumber: user.phoneNumber || phoneNumber,
            };

            const response = await ApiClient.post<ApiResponse>('/api/users/auth/phone', requestBody);

            if (response.data.header.responseCode === 201) {
                console.log('User registered successfully');
                await AsyncStorage.setItem('user_id', response.data.response.user_id);
                await AsyncStorage.setItem('user_name', response.data.response.user_name);
            } else if (response.data.header.responseCode === 200) {
                throw new Error(response.data.header.responseMessage || 'Registration failed');
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.header?.responseMessage || error.message || 'Failed to register user';
            Alert.alert('Error', errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Background />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.vectorContainer}>
                    <LoginVector />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                {!showOTPInput ? (
                    // Phone Number Input
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter phone number (with country code)"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                            placeholderTextColor="#666666"
                        />
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSendCode}
                            disabled={loading || !phoneNumber}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Send Verification Code</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    // OTP Input
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter verification code"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            keyboardType="number-pad"
                            placeholderTextColor="#666666"
                            maxLength={6}
                        />
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleVerifyCode}
                            disabled={loading || verificationCode.length < 6}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.buttonText}>Verify Code</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={() => {
                                setShowOTPInput(false);
                                setVerificationCode('');
                            }}
                        >
                            <Text style={styles.resendText}>Change Phone Number</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.googleButton}
                    // onPress={() => {handleGoogleSignIn}}
                >
                    <Text style={styles.buttonText}>Sign in with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.linkText}>
                        Don't have an account? <Text style={styles.linkTextBold}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
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
        justifyContent: 'center',
        padding: 20,
    },
    vectorContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginVertical: 20,
    },
    input: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#DDDDDD',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666666',
        marginBottom: 30,
        textAlign: 'center',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    googleButton: {
        backgroundColor: '#4285F4',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendButton: {
        alignItems: 'center',
        padding: 10,
    },
    resendText: {
        color: theme.colors.primary,
        fontSize: 16,
    },
    linkText: {
        color: theme.colors.text,
        textAlign: 'center',
    },
    linkTextBold: {
        fontWeight: 'bold',
        color: theme.colors.secondary,
    },
});
