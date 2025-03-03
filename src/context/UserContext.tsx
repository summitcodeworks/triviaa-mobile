// src/globalUser.ts
import { UserData } from '../models/UserData'; // Adjust path
import { UserStorageService } from '../service/user-storage.service'; // Adjust path

// Global variable to hold user data
export let globalUser: UserData | null = null;

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
