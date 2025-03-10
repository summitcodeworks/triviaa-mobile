import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ActivityIndicator,
    Image,
    Platform,
    PermissionsAndroid,
    Linking,
    Modal,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import type {ImagePickerResponse} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import ApiClient from '../utils/apiClient.ts';
import {RootStackScreenProps} from '../types/navigation.ts';
import {DEFAULT_PROFILE_PICTURE, DEVICE_TOKEN, gPhoneNumber} from '../../globals.tsx';
import {UserStorageService} from "../service/user-storage.service.ts";
import {UserData} from "../models/UserData.ts";
import {globalUser, setGlobalUser} from "../context/UserContext.tsx";

const ANDROID_API_LEVEL = Platform.Version as number;

const theme = {
    colors: {
        background: '#F5F5F5',
        primary: '#007AFF',
        success: '#34C759',
        error: '#FF3B30',
        text: '#000000',
        inputBackground: '#FFFFFF',
        warning: '#FF9500',
    },
};

export default function UserDetailsScreen({
                                              route,
                                              navigation,
                                          }: RootStackScreenProps<'UserDetails'>) {
    const {phoneNumber, deviceToken, userKey} = route.params;
    const userStorage = new UserStorageService();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        userKey: '',
        phoneNumber: '',
        deviceToken: '',
        username: '',
        name: '',
        email: '',
        age: '',
        profilePicture: null as
            | unknown
            | 'https://firebasestorage.googleapis.com/v0/b/triviaa-14824.firebasestorage.app/o/profile_pictures%2F1739677298388_rn_image_picker_lib_temp_577061f6-a2ef-4b70-ba5e-6392a126ece2.jpg?alt=media&token=a18bba62-619f-47de-adfe-5a4ea6e20bab',
    });
    const [errors, setErrors] = useState({
        username: '',
        name: '',
        age: '',
    });
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<
        boolean | null
    >(null);
    const [isUnder13, setIsUnder13] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [hasUserTyped, setHasUserTyped] = useState(false);
    const [showAgeDialog, setShowAgeDialog] = useState(false);
    const [tempAge, setTempAge] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        setFormData(prev => ({...prev, phoneNumber}));
        setFormData(prevState => ({...prevState, deviceToken}));
        setFormData(prevState => ({...prevState, userKey}));
        
        if (globalUser) {
            setFormData(prevState => ({...prevState, username: globalUser.username || ''}));
            setFormData(prevState => ({...prevState, name: globalUser.user_name || ''}));
            setFormData(prevState => ({...prevState, email: globalUser.user_email || ''}));
            setFormData(prevState => ({...prevState, profilePicture: globalUser.user_photo_url || null}));
            setFormData(prevState => ({...prevState, age: globalUser.age || ''}));
            setIsEditMode(true);
        }
        
        console.log('UserDetailsScreen globalUser: ' + globalUser + ' ' + JSON.stringify(globalUser));
    }, [phoneNumber, deviceToken, userKey]);

    useEffect(() => {
        if (!hasUserTyped) return;
        
        const checkUsername = async () => {
            if (formData.username.length >= 3) {
                setIsCheckingUsername(true);
                const isAvailable = await checkUsernameAvailability(formData.username, deviceToken);
                setIsUsernameAvailable(isAvailable);
                setIsCheckingUsername(false);

                if (!isAvailable) {
                    setErrors(prev => ({
                        ...prev,
                        username: 'Username is already taken',
                    }));
                } else {
                    setErrors(prev => ({
                        ...prev,
                        username: '',
                    }));
                }
            } else {
                setIsUsernameAvailable(null);
                setErrors(prev => ({
                    ...prev,
                    username: '',
                }));
            }
        };

        const debounceTimer = setTimeout(checkUsername, 500);
        return () => clearTimeout(debounceTimer);
    }, [formData.username, deviceToken, hasUserTyped]);

    useEffect(() => {
        // Check age whenever it changes
        const age = parseInt(formData.age);
        setIsUnder13(age > 0 && age < 13);
    }, [formData.age]);

    const checkUsernameAvailability = async (
        username: string,
        deviceToken: string
    ): Promise<boolean> => {
        try {
            console.log('Checking username availability:', username);
            const response = await ApiClient.get(
                `/api/users/check-username/${username}`,
            );
            if (response.data.header.responseCode === 200) {
                return !response.data.response.exists;
            } else {
                throw new Error(response.data.header.responseMessage);
            }
        } catch (error) {
            console.error('Error checking username availability:', error);
            throw error;
        }
        // await new Promise(resolve => setTimeout(resolve, 500));
        // return !username.toLowerCase().includes('taken');
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            username: '',
            name: '',
            age: '',
        };

        console.log('Validating username:', formData.username);

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
            console.log('Username is required');
        } else if (/\s/.test(formData.username)) {
            newErrors.username = 'Username cannot contain spaces';
            isValid = false;
            console.log('Username contains spaces');
        } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
            newErrors.username = 'Username cannot contain special characters';
            isValid = false;
            console.log('Username contains special characters');
        } else if (!isUsernameAvailable && !isEditMode) {
            newErrors.username = 'Username is already taken';
            isValid = false;
            console.log('Username is already taken');
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
            console.log('Name is required');
        }

        if (!isEditMode && !formData.age.trim()) {
            newErrors.age = 'Age is required';
            isValid = false;
            console.log('Age is required');
        } else if (formData.age && (isNaN(parseInt(formData.age)) || parseInt(formData.age) <= 0 || parseInt(formData.age) > 120)) {
            newErrors.age = 'Please enter a valid age';
            isValid = false;
            console.log('Invalid age');
        }

        setErrors(newErrors);
        console.log('Validation errors:', newErrors);
        return isValid;
    };

    const registerUser = async (userData) => {
        try {
            if (isEditMode) {
                // Update user details using the update endpoint
                const response = await ApiClient.put(`/api/users/${globalUser.user_id}`, {
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    profilePicture: userData.profilePicture,
                    username: userData.username,
                    deviceToken: userData.deviceToken,
                    userKey: userData.userKey
                });
                console.log('registerUser response: ' + JSON.stringify(response));
                return {
                    success: true,
                    data: response.data,
                    status: response.status
                };
            } else {
                // Register new user using the registration endpoint
                const response = await ApiClient.post('/api/users/auth/phone', {
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    profilePicture: userData.profilePicture,
                    username: userData.username,
                    deviceToken: userData.deviceToken,
                    userKey: userData.userKey,
                    age: userData.age // Include age for registration
                });
                console.log('registerUser response: ' + JSON.stringify(response));
                return {
                    success: true,
                    data: response.data,
                    status: response.status
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'An error occurred',
                status: error.response?.status
            };
        }
    };

    const handleAgeSubmit = () => {
        const age = parseInt(tempAge);
        if (isNaN(age) || age <= 0 || age > 120) {
            setErrors(prev => ({...prev, age: 'Please enter a valid age'}));
            return;
        }
        
        if (age < 13) {
            Alert.alert(
                'Age Restriction',
                'You must be 13 or older to register.',
                [{ text: 'OK' }]
            );
            setShowAgeDialog(false);
            setTempAge('');
            return;
        }

        setFormData(prev => ({...prev, age: tempAge}));
        setShowAgeDialog(false);
        setTempAge('');
        
        // Proceed with registration after age is set
        if (validateForm()) {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!isEditMode) {
            setShowAgeDialog(true);
            return;
        }

        if (validateForm()) {
            try {
                setIsLoading(true);

                // Clean up phone number - remove any spaces, dashes, or other formatting
                const cleanPhoneNumber = formData.phoneNumber.replace(/[\s-()]/g, '');

                const userData = {
                    ...formData,
                    phoneNumber: cleanPhoneNumber,
                    profilePicture: formData.profilePicture || DEFAULT_PROFILE_PICTURE
                };

                const result = await registerUser(userData);
                setIsLoading(false);
                console.log('registerUser result: ' + JSON.stringify(result));
                if (result.success) {
                    const userDataStorage = await userStorage.saveUser(new UserData(result.data.response));
                    console.log('userDataStorage: ' + JSON.stringify(userDataStorage));
                    if (userDataStorage) {
                        // Update global user context
                        setGlobalUser(result.data.response);
                        Alert.alert(
                            'Success',
                            isEditMode ? 'Profile updated successfully!' : 'Registration successful!',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        console.log('storageSuccess: ' + JSON.stringify(userDataStorage));
                                        navigation.navigate('MainTabs');
                                    }
                                }
                            ]
                        );
                    } else {
                        Alert.alert(
                            'Warning',
                            isEditMode 
                                ? 'Changes saved but failed to update local data. Some features might not work properly.'
                                : 'Registration successful but failed to save data locally. Some features might not work properly.',
                        );
                    }
                } else {
                    Alert.alert(
                        'Error',
                        result.error?.header?.responseMessage || (isEditMode ? 'Failed to update profile.' : 'Registration failed. Please try again.'),
                    );
                }
            } catch (error) {
                setIsLoading(false);
                Alert.alert(
                    'Error',
                    'An unexpected error occurred. Please try again.'
                );
            }
        }
    };

    const renderUsernameStatus = () => {
        if (isCheckingUsername) {
            return <ActivityIndicator size="small" color={theme.colors.primary} />;
        }
        if (formData.username.length >= 3) {
            if (isUsernameAvailable) {
                return (
                    <Icon name="checkmark-circle" size={20} color={theme.colors.success} />
                );
            }
            return <Icon name="close-circle" size={20} color={theme.colors.error} />;
        }
        return null;
    };

    const requestCameraPermissions = async (): Promise<boolean> => {
        if (Platform.OS === 'ios') {
            return true;
        }

        try {
            if (ANDROID_API_LEVEL >= 34) {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED,
                ];

                const results = await PermissionsAndroid.requestMultiple(permissions);

                return Object.values(results).every(
                    result => result === PermissionsAndroid.RESULTS.GRANTED,
                );
            } else if (ANDROID_API_LEVEL >= 33) {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                ];

                const results = await PermissionsAndroid.requestMultiple(permissions);

                return Object.values(results).every(
                    result => result === PermissionsAndroid.RESULTS.GRANTED,
                );
            } else {
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ];

                const results = await PermissionsAndroid.requestMultiple(permissions);

                return Object.values(results).every(
                    result => result === PermissionsAndroid.RESULTS.GRANTED,
                );
            }
        } catch (err) {
            console.warn('Permission request error:', err);
            return false;
        }
    };

    const checkAndRequestPermissions = async (
        type: 'camera' | 'library',
    ): Promise<boolean> => {
        if (Platform.OS === 'ios') {
            return true;
        }

        try {
            if (type === 'camera') {
                return await requestCameraPermissions();
            } else {
                if (ANDROID_API_LEVEL >= 34) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED,
                        {
                            title: 'Photo Library Access',
                            message:
                                'We need access to your photo library to select a profile picture.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else if (ANDROID_API_LEVEL >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        {
                            title: 'Photo Library Access',
                            message:
                                'We need access to your photo library to select a profile picture.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        {
                            title: 'Photo Library Access',
                            message:
                                'We need access to your photo library to select a profile picture.',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            }
        } catch (err) {
            console.warn('Permission check error:', err);
            return false;
        }
    };

    const handleSelectImage = async () => {
        try {
            Alert.alert(
                'Select Profile Picture',
                'Choose how you want to select your profile picture',
                [
                    {
                        text: 'Take Photo',
                        onPress: async () => {
                            const hasPermission = await checkAndRequestPermissions('camera');
                            if (!hasPermission) {
                                Alert.alert(
                                    'Permission Denied',
                                    'Please enable camera permissions in your device settings to take a photo.',
                                    [
                                        {
                                            text: 'Open Settings',
                                            onPress: () => {
                                                if (Platform.OS === 'ios') {
                                                    Linking.openSettings();
                                                } else {
                                                    Linking.openSettings();
                                                }
                                            },
                                        },
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                    ],
                                );
                                return;
                            }

                            const result = await launchCamera({
                                mediaType: 'photo',
                                includeBase64: false,
                                maxHeight: 1200,
                                maxWidth: 1200,
                                quality: 0.8,
                                saveToPhotos: false,
                            });

                            handleImagePickerResponse(result);
                        },
                    },
                    {
                        text: 'Choose from Library',
                        onPress: async () => {
                            const hasPermission = await checkAndRequestPermissions('library');
                            if (!hasPermission) {
                                Alert.alert(
                                    'Permission Denied',
                                    'Please enable photo library access in your device settings.',
                                    [
                                        {
                                            text: 'Open Settings',
                                            onPress: () => {
                                                Linking.openSettings();
                                            },
                                        },
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                    ],
                                );
                                return;
                            }

                            const result = await launchImageLibrary({
                                mediaType: 'photo',
                                includeBase64: false,
                                maxHeight: 1200,
                                maxWidth: 1200,
                                quality: 0.8,
                                selectionLimit: 1,
                            });

                            handleImagePickerResponse(result);
                        },
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ],
            );
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    const uploadImageToFirebase = async (asset: {
        uri: string;
        type?: string;
        fileName?: string;
    }): Promise<string> => {
        try {
            console.log('Starting upload...');
            console.log('Asset URI:', asset.uri);

            const fileName = `profile_pictures/${Date.now()}_${
                asset.fileName || 'profile.jpg'
            }`;
            const reference = storage().ref(fileName);

            console.log('Storage reference created:', fileName);
            console.log('Reference path:', reference.bucket);

            console.log('Uploading file...');
            await reference.putFile(asset.uri);

            console.log('File uploaded successfully.');

            console.log('Getting download URL...');
            const url = await reference.getDownloadURL();

            console.log('Download URL:', url);

            return url;
        } catch (error) {
            console.error('Firebase upload error:', error);
            if (error.code === 'storage/object-not-found') {
                Alert.alert('Error', 'File not found. Please check the file path.');
            } else {
                Alert.alert('Error', 'Failed to upload image. Please try again.');
            }
            throw error;
        }
    };

    const handleImagePickerResponse = async (response: ImagePickerResponse) => {
        if (response.didCancel) {
            return;
        }

        if (response.errorCode) {
            let errorMessage = 'Unknown error occurred';
            switch (response.errorCode) {
                case 'camera_unavailable':
                    errorMessage = 'Camera is not available on this device';
                    break;
                case 'permission':
                    errorMessage = 'Permission not granted';
                    break;
                case 'others':
                    errorMessage = response.errorMessage || 'Unknown error occurred';
                    break;
            }
            Alert.alert('Error', errorMessage);
            return;
        }

        const asset = response.assets?.[0];
        if (!asset?.uri) {
            Alert.alert('Error', 'No image was selected');
            return;
        }

        if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
            Alert.alert('Error', 'Image size must be less than 5MB');
            return;
        }

        try {
            setIsUploading(true);
            const downloadUrl = await uploadImageToFirebase(asset);
            setFormData(prev => ({
                ...prev,
                profilePicture: downloadUrl,
            }));
        } catch (error) {
            console.error('Error handling image:', error);
            Alert.alert('Error', 'Failed to process image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    //     // Optional: Function to delete old profile picture
    //     const deleteOldProfilePicture = async (url: string) => {
    //         try {
    //             // Extract the path from the URL
    //             const urlPath = storage().refFromURL(url);
    //             await urlPath.delete();
    //         } catch (error) {
    //             console.error('Error deleting old profile picture:', error);
    //             // Don't throw error as this is not critical
    //         }
    //     };
    //
    // // Optional: Function to get image thumbnail URL
    //     const getThumbnailUrl = (originalUrl: string, size: number = 200): string => {
    //         // Firebase Storage allows you to add query parameters for transformed images
    //         // Format might vary based on your Firebase configuration
    //         return `${originalUrl}?width=${size}&height=${size}&alt=media`;
    //     };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>{isEditMode ? 'Edit Profile' : 'Enter Your Details'}</Text>
                <View style={styles.placeholder} />
            </View>
            
            <View style={styles.content}>
                {isUploading && (
                    <View style={styles.uploadingOverlay}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text>Uploading...</Text>
                    </View>
                )}

                {/* Profile Picture Section */}
                <View style={styles.profilePictureContainer}>
                    <TouchableOpacity onPress={handleSelectImage}>
                        <View style={styles.profilePictureWrapper}>
                            {formData.profilePicture ? (
                                <Image
                                    source={{uri: formData.profilePicture}}
                                    style={styles.profilePicture}
                                />
                            ) : (
                                <View style={styles.profilePlaceholder}>
                                    <Icon name="person" size={40} color="#CCCCCC" />
                                </View>
                            )}
                            <View style={styles.editIconContainer}>
                                <Icon name="camera" size={14} color="#FFFFFF" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Username *</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[
                                styles.input,
                                errors.username ? styles.inputError : null,
                                {flex: 1},
                            ]}
                            placeholder="Enter username"
                            value={formData.username}
                            onChangeText={text => {
                                if (!hasUserTyped) setHasUserTyped(true);
                                setFormData({...formData, username: text});
                                if (errors.username) {setErrors({...errors, username: ''});}
                            }}
                            autoCapitalize="none"
                        />
                        <View style={styles.statusIcon}>{renderUsernameStatus()}</View>
                    </View>
                    {errors.username ? (
                        <Text style={styles.errorText}>{errors.username}</Text>
                    ) : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={[styles.input, errors.name ? styles.inputError : null]}
                        placeholder="Enter name"
                        value={formData.name}
                        onChangeText={text => {
                            setFormData({...formData, name: text});
                            if (errors.name) {setErrors({...errors, name: ''});}
                        }}
                    />
                    {errors.name ? (
                        <Text style={styles.errorText}>{errors.name}</Text>
                    ) : null}
                </View>

                {/* <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age *</Text>
                    <TouchableOpacity 
                        style={[styles.input, errors.age ? styles.inputError : null]}
                        onPress={() => setShowAgeDialog(true)}
                    >
                        <Text style={formData.age ? styles.inputText : styles.placeholderText}>
                            {formData.age ? formData.age : 'Enter age'}
                        </Text>
                    </TouchableOpacity>
                    {errors.age ? (
                        <Text style={styles.errorText}>{errors.age}</Text>
                    ) : null}
                </View> */}

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email (optional)"
                        value={formData.email}
                        onChangeText={text => setFormData({...formData, email: text})}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        !isUsernameAvailable &&
                        formData.username.length >= 3 &&
                        !isEditMode &&
                        styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isUsernameAvailable && formData.username.length >= 3 && !isEditMode}>
                    <Text style={styles.buttonText}>{isEditMode ? 'Save Changes' : 'Save Details'}</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showAgeDialog}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowAgeDialog(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Your Age</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Enter age"
                            value={tempAge}
                            onChangeText={setTempAge}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalCancelButton]}
                                onPress={() => {
                                    setShowAgeDialog(false);
                                    setTempAge('');
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalSubmitButton]}
                                onPress={handleAgeSubmit}
                            >
                                <Text style={[styles.modalButtonText, styles.modalSubmitButtonText]}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    backButton: {
        padding: 8,
    },
    placeholder: {
        width: 40, // Same width as back button for balanced layout
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'left',
        color: theme.colors.text,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.inputBackground,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E1E1E1',
    },
    statusIcon: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
        color: theme.colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E1E1E1',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: theme.colors.text,
        backgroundColor: theme.colors.inputBackground,
    },
    inputError: {
        borderColor: theme.colors.error,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        marginTop: 4,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        backgroundColor: '#FFF5E6',
        padding: 8,
        borderRadius: 6,
    },
    warningText: {
        color: theme.colors.warning,
        fontSize: 12,
        marginLeft: 8,
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePictureWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E1E1E1',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    profilePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    uploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: theme.colors.text,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#E1E1E1',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
        color: theme.colors.text,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    modalCancelButton: {
        backgroundColor: '#F5F5F5',
    },
    modalSubmitButton: {
        backgroundColor: theme.colors.primary,
    },
    modalButtonText: {
        fontSize: 16,
        color: theme.colors.text,
    },
    modalSubmitButtonText: {
        color: '#FFFFFF',
    },
    inputText: {
        color: theme.colors.text,
    },
    placeholderText: {
        color: '#999999',
    },
});
