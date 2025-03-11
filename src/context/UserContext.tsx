// src/globalUser.ts
import { UserData } from '../models/UserData'; 
import { UserStorageService } from '../service/user-storage.service'; 

// Global variable to hold user data
export let globalUser: UserData | null = null;

export const DEFAULT_PROFILE_PICTURE = 'https://firebasestorage.googleapis.com/v0/b/triviaa-14824.firebasestorage.app/o/profile_pictures%2Fdefault_profile_picture.jpg?alt=media&token=fc17ac5f-64f1-46e5-a4e0-7f84097cb573';

// Function to initialize the global user (called once at app start)
export const initializeGlobalUser = async (): Promise<void> => {
    if (globalUser === null) { // Only fetch if not already set
        const userStorage = new UserStorageService();
        try {
            const userData = await userStorage.getUser();
            globalUser = userData;
            console.log('Global user initialized:', globalUser?.user_id);
        } catch (error) {
            console.error('Failed to initialize global user:', error);
            globalUser = null; // Reset on error
        }
    }
};

// Optional: Function to update global user if needed later
export const setGlobalUser = (user: UserData | null) => {
    globalUser = user;
};

// Optional: Function to get global user (for clarity in code)
export const getGlobalUser = (): UserData | null => globalUser;
