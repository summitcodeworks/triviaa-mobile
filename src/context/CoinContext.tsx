import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CoinContextType = {
    coins: number;
    addCoins: (amount: number) => Promise<void>;
};

const CoinContext = createContext<CoinContextType | undefined>(undefined);

export const useCoins = () => {
    const context = useContext(CoinContext);
    if (context === undefined) {
        throw new Error('useCoins must be used within a CoinProvider');
    }
    return context;
};

export const CoinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [coins, setCoins] = useState(0);

    // Load coins only once when component mounts
    useEffect(() => {
        let isMounted = true;

        const loadCoins = async () => {
            try {
                const storedCoins = await AsyncStorage.getItem('coins');
                if (storedCoins !== null && isMounted) {
                    setCoins(parseInt(storedCoins, 10));
                }
            } catch (error) {
                console.error('Error loading coins:', error);
            }
        };

        loadCoins();

        return () => {
            isMounted = false;
        };
    }, []);

    const addCoins = useCallback(async (amount: number) => {
        try {
            const newTotal = coins + amount;
            await AsyncStorage.setItem('coins', newTotal.toString());
            setCoins(newTotal);
        } catch (error) {
            console.error('Error saving coins:', error);
        }
    }, [coins]);

    const value = React.useMemo(() => ({
        coins,
        addCoins
    }), [coins, addCoins]);

    return (
        <CoinContext.Provider value={value}>
            {children}
        </CoinContext.Provider>
    );
};
