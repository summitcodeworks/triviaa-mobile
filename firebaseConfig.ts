import { initializeApp, getApp } from '@react-native-firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyC1m6YjmpcCZjaZjLCllfktQSkjI6k22CY',
    authDomain: 'triviaa-14824.firebaseapp.com',
    projectId: 'triviaa-14824',
    storageBucket: 'triviaa-14824.firebasestorage.app',
    messagingSenderId: '596817273399',
    appId: '1:596817273399:web:cf9dd29c7a0ec3992d15b2',
    measurementId: 'G-G4245F1852',
};

try {
    initializeApp(firebaseConfig);
} catch (error) {
    // If an initialization error occurs, attempt to get the existing app
    getApp();
}

export default getApp();
