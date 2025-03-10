import React, {useState} from 'react';
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
  StatusBar,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {theme} from '../constants/theme';
import type {RootStackScreenProps} from '../types/navigation';
import {LoginVector} from '../components/VectorGraphics';
import ApiClient from '../utils/apiClient.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserStorageService} from '../service/user-storage.service.ts';
import {UserData} from '../models/UserData.ts';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
import {ChevronDown} from 'react-native-feather'; // Assuming you have some icon library

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
  userName?: string;
  email?: string;
  password?: string;
  photoUrl?: string;
  phoneNumber: string;
}

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<'Login'>) {
  const userStorage = new UserStorageService();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
    setShowCountryPicker(false);
  };

  const handleSendCode = async () => {
    try {
      setLoading(true);
      // Format the phone number with the country code
      const formattedNumber = `+${callingCode}${phoneNumber}`;
      console.log('Formatted number: ' + formattedNumber);
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);
      if (confirmation.verificationId) {
        setVerificationId(confirmation.verificationId);
        setShowOTPInput(true);
        Alert.alert('Success', 'Verification code has been sent to your phone.');
      } else {
        Alert.alert('Error', 'Failed to get verification ID');
      }
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
        verificationCode,
      );

      const user = await auth().signInWithCredential(credential);
      console.log('User signed in:', user);
      await checkPhoneExists(user);
    } catch (error: any) {
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
      const formattedNumber = `+${callingCode}${phoneNumber.replace(/[\s-()]/g, '')}`;

      const requestBody: RegisterUserRequest = {
        phoneNumber: user.phoneNumber?.replace(/[\s-()]/g, '') || formattedNumber,
      };

      console.log('User login details: ' + JSON.stringify(user));

      const response = await ApiClient.post<ApiResponse>(
        '/api/users/check-phone',
        requestBody,
      );

      if (response.data && response.data.header.responseCode === 200) {
        if (response.data.response.exists) {
          const userData = new UserData(response.data.response);
          userStorage.saveUser(userData);
        } else {
          navigation.replace('UserDetails', {
            phoneNumber: user.phoneNumber?.replace(/[\s-()]/g, '') || formattedNumber,
            deviceToken: deviceToken,
            userKey: user.user.uid,
          });
        }
      } else if (response.data.header.responseCode === 200) {
        throw new Error(
          response.data.header.responseMessage || 'Registration failed',
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.header?.responseMessage ||
        error.message ||
        'Failed to register user';
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
      const formattedNumber = `+${callingCode}${phoneNumber}`;

      const requestBody: RegisterUserRequest = {
        userName: userName || user.displayName || '',
        email: email || user.email || '',
        password: password,
        photoUrl: photoUrl || user.photoURL || '',
        phoneNumber: user.phoneNumber || formattedNumber,
      };

      const response = await ApiClient.post<ApiResponse>(
        '/api/users/auth/phone',
        requestBody,
      );

      if (response.data.header.responseCode === 201) {
        console.log('User registered successfully');
        await AsyncStorage.setItem('user_id', response.data.response.user_id);
        await AsyncStorage.setItem(
          'user_name',
          response.data.response.user_name,
        );
      } else if (response.data.header.responseCode === 200) {
        throw new Error(
          response.data.header.responseMessage || 'Registration failed',
        );
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.header?.responseMessage ||
        error.message ||
        'Failed to register user';
      Alert.alert('Error', errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}>
        <View style={styles.logoContainer}>
          <LoginVector />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        {!showOTPInput ? (
          // Phone Number Input with Country Code Picker
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity
                style={styles.countryPickerButton}
                onPress={() => setShowCountryPicker(true)}>
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCallingCode
                  withCallingCodeButton
                  withEmoji
                  preferredCountries={['IN', 'US', 'GB', 'CA', 'AU', 'NZ']}
                  onSelect={onSelectCountry}
                  visible={showCountryPicker}
                  onClose={() => setShowCountryPicker(false)}
                  containerButtonStyle={styles.countryPickerButtonContent}
                />
                <ChevronDown width={16} height={16} color="#666" />
              </TouchableOpacity>

              <TextInput
                style={styles.phoneInput}
                placeholder="Phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSendCode}
              disabled={loading || !phoneNumber}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Send Verification Code
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          // OTP Input
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChangeText={setVerificationCode}
              keyboardType="number-pad"
              placeholderTextColor="#999"
              maxLength={6}
            />
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading || verificationCode.length < 6}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setShowOTPInput(false);
                setVerificationCode('');
              }}>
              <Text style={styles.secondaryButtonText}>
                Change Phone Number
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupContainer}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>
            Don't have an account?{' '}
            <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  countryPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginRight: 8,
  },
  countryPickerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333333',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    padding: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#666666',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#666666',
    fontSize: 16,
  },
  linkTextBold: {
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
});
