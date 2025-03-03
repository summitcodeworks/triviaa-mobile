// src/services/storage/user-storage.service.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '../models/UserData.ts';

const TAG = 'user-storage';

export class UserStorageService {
    private readonly STORAGE_KEY = '@user_data_v1';
    private readonly LAST_ACTIVE_KEY = '@last_active';

    async saveUser(userData: UserData): Promise<boolean> {
        try {
            const dataToStore = {
                userData: userData.toJSON(),
                timestamp: new Date().toISOString()
            };
            const jsonString = JSON.stringify(dataToStore);
            await AsyncStorage.setItem(this.STORAGE_KEY, jsonString);
            await this.updateLastActive();
            // Verify the save
            const savedData = await AsyncStorage.getItem(this.STORAGE_KEY);
            if (!savedData) {
                console.warn('Data was not persisted after save');
                return false;
            }
            console.log(TAG, 'saveUser' + savedData);
            return true;
        } catch (error) {
            console.error('Failed to save user data:', error);
            throw error; // Throw instead of just returning false
        }
    }

    async getUser(): Promise<UserData | null> {
        try {
            const jsonData = await AsyncStorage.getItem(this.STORAGE_KEY);
            if (!jsonData) {
                console.log('No user data found in storage');
                return null;
            }

            const parsedData = JSON.parse(jsonData);
            if (!parsedData?.userData) {
                console.warn('Invalid user data format in storage');
                return null;
            }

            const user = new UserData();
            user.fromJSON(parsedData.userData);
            await this.updateLastActive();
            console.log(TAG, 'getUser: ' + JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Failed to get user data:', error);
            return null;
        }
    }

    async updateUser(updates: Partial<UserData>): Promise<boolean> {
        try {
            const currentUser = await this.getUser();
            if (!currentUser) {
                console.log('No existing user to update');
                return false;
            }

            const updatedUser = new UserData({
                ...currentUser.toJSON(),
                ...updates
            });

            return await this.saveUser(updatedUser);
        } catch (error) {
            console.error('Failed to update user data:', error);
            throw error;
        }
    }

    private async updateLastActive(): Promise<void> {
        try {
            const timestamp = new Date().toISOString();
            await AsyncStorage.setItem(this.LAST_ACTIVE_KEY, timestamp);
        } catch (error) {
            console.error('Failed to update last active:', error);
        }
    }

    async getLastActive(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(this.LAST_ACTIVE_KEY);
        } catch (error) {
            console.error('Failed to get last active:', error);
            return null;
        }
    }

    async hasUser(): Promise<boolean> {
        try {
            const value = await AsyncStorage.getItem(this.STORAGE_KEY);
            return value !== null && value !== undefined;
        } catch (error) {
            console.error('Failed to check user existence:', error);
            return false;
        }
    }

    async logout(): Promise<boolean> {
        try {
            await AsyncStorage.removeItem(this.STORAGE_KEY);
            const remaining = await AsyncStorage.getItem(this.STORAGE_KEY);
            return remaining === null;
        } catch (error) {
            console.error('Failed to logout:', error);
            return false;
        }
    }

    async clearAll(): Promise<boolean> {
        try {
            await AsyncStorage.clear();
            const keys = await AsyncStorage.getAllKeys();
            return keys.length === 0;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }
}
