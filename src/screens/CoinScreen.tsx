import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { ArrowDownLeft, ArrowLeft, ArrowUpRight } from 'lucide-react-native';
import { RootStackScreenProps } from '../types/navigation.ts';
import FAIcon from '@react-native-vector-icons/fontawesome5';
import { theme } from '../constants/theme.ts';
import { useFocusEffect } from '@react-navigation/native';
import { UserData } from '../models/UserData.ts';
import { UserStorageService } from '../service/user-storage.service.ts';
import ApiClient from '../utils/apiClient.ts';
import { globalUser } from "../context/UserContext.tsx";
import { CoinsTransactionResponse } from "../models/CoinsTransactionResponse.ts";
import { AxiosResponse } from "axios";
import { CoinsBalanceResponse } from "../models/CoinsBalanceResponse.ts";

export default function CoinScreen({ navigation }: RootStackScreenProps<'Coins'>) {
    const userStorage = new UserStorageService();
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<UserData | null>(null);

    const fetchCoinData = async () => {
        try {
            const COIN_BALANCE_URL = '/api/coins/balance/' + globalUser?.user_id;
            const balanceResponse = await ApiClient.get<CoinsBalanceResponse>(COIN_BALANCE_URL) as AxiosResponse<CoinsBalanceResponse>;
            if (balanceResponse.data.header.responseCode === 200) {
                setBalance(balanceResponse.data.response.coin_balance);
            } else {
                console.log(balanceResponse.data.header.responseMessage || 'Failed to fetch balance');
            }

            const COINS_TRANSACTION_URL = '/api/coins/transactions/' + globalUser?.user_id;
            const transactionResponse = await ApiClient.get<CoinsTransactionResponse>(COINS_TRANSACTION_URL) as AxiosResponse<CoinsTransactionResponse>;
            if (transactionResponse.data.header.responseCode === 200) {
                const mappedTransactions = transactionResponse.data.response.map((transaction: any) => ({
                    id: transaction.transaction_id,
                    type: transaction.transaction_type,
                    amount: transaction.transaction_amount,
                    description: transaction.comment,
                    date: transaction.transaction_date,
                    category: 'Misc',
                }));
                setTransactions(mappedTransactions);
            } else {
                console.log(transactionResponse.data.header.responseMessage || 'Failed to fetch transactions');
            }
        } catch (error) {
            console.log('Error ' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const userData = await userStorage.getUser();
                setUser(userData);
                fetchCoinData();
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                fetchCoinData();
            }
        }, [user])
    );

    const renderTransaction = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
                {item.type === 'credit' ? (
                    <ArrowUpRight color="#22c55e" size={24} />
                ) : (
                    <ArrowDownLeft color="#ef4444" size={24} />
                )}
            </View>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={[styles.amount, item.type === 'credit' ? styles.creditAmount : styles.debitAmount]}>
                    {item.type === 'credit' ? '+' : '-'}{item.amount.toFixed(0)}
                </Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft color={theme.colors.primary} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>My Coins</Text>
            </View>

            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <FAIcon
                        name="coins"
                        iconStyle="solid"
                        size={20}
                        color="#FFD700"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.balanceAmount}>{balance !== null ? balance.toFixed(0) : '0.00'}</Text>
                </View>
                {/*<Text style={styles.balanceAmount}>{balance !== null ? balance.toFixed(2) : "0.00"} coins</Text>*/}
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Currently in development')}>
                    <Text style={styles.actionButtonText}>Encash Coins</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('AddCoins')}>
                    <Text style={styles.actionButtonText}>Add Coins</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transactionsContainer}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <FlatList
                    data={transactions}
                    renderItem={renderTransaction}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    balanceContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
        marginTop: 20,
    },
    balanceLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#111827',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        paddingVertical: 14,
        marginHorizontal: 10,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
        alignItems: 'center',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    transactionsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginStart: 8,
        marginEnd: 8,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        marginBottom: 4,
    },
    transactionCategory: {
        fontSize: 14,
        color: '#6b7280',
    },
    transactionAmount: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    creditAmount: {
        color: '#22c55e',
    },
    debitAmount: {
        color: '#ef4444',
    },
    date: {
        fontSize: 12,
        color: '#6b7280',
    },
    closeButton: {
        position: 'absolute',
        left: 10,
        top: 20,
    },
    backButton: {
        marginRight: 16,
    },
});
