import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from "react";

export const DEVICE_TOKEN_KEY = '@fcm_token';
export const FAUTH_USER_KEY = 'FAUTH_USER_KEY';
export var userId: number | null = -1;
export const DEFAULT_PROFILE_PICTURE: string = 'https://firebasestorage.googleapis.com/v0/b/triviaa-14824.firebasestorage.app/o/profile_pictures%2Fdefault_profile_picture.jpg?alt=media&token=fc17ac5f-64f1-46e5-a4e0-7f84097cb573';

export const globals: Globals = {
	deviceToken: null, // Initialize as `null`

	// Method to fetch the device token from AsyncStorage
	async getDeviceToken(): Promise<string | null> {
		try {
			const token = await AsyncStorage.getItem('deviceToken');
			this.deviceToken = token; // Update the global variable
			return token;
		} catch (error) {
			console.error('Error fetching device token from AsyncStorage:', error);
			return null;
		}
	},

	// Method to save the device token to AsyncStorage
	async setDeviceToken(token: string): Promise<void> {
		try {
			await AsyncStorage.setItem('deviceToken', token);
			this.deviceToken = token; // Update the global variable
		} catch (error) {
			console.error('Error saving device token to AsyncStorage:', error);
		}
	},
};

interface Globals {
	deviceToken: string | null; // Allow `null` if the token might not be set initially
}
