import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import FAIcon from '@react-native-vector-icons/fontawesome5';
import { theme } from '../constants/theme';
import type { RootStackScreenProps } from '../types/navigation';
import {globalUser} from '../context/UserContext.tsx';
import ApiClient from '../utils/apiClient.ts';
import {AxiosResponse} from 'axios';
import {PointsBalanceResponse} from '../models/PointsBalanceResponse.ts';
import {PointsTransaction, PointsTransactionResponse} from '../models/PointsTransactionResponse.ts';


export default function PointsScreen({ navigation }: RootStackScreenProps<'Points'>) {
    const [pointsBalance, setPointsBalance] = useState(0);
    const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPointsData();
    }, []);

    const fetchPointsData = async () => {
        try {
            const POINTS_BALANCES_URL = '/api/points/balance/' + globalUser?.user_id;
            const balanceResponse = await ApiClient.get<PointsBalanceResponse>(POINTS_BALANCES_URL) as AxiosResponse<PointsBalanceResponse>;
            if (balanceResponse.data.header.responseCode === 200) {
                setPointsBalance(balanceResponse.data.response.total_points);
            } else {
                console.log(balanceResponse.data.header.responseMessage || 'Failed to fetch balance');
            }

            const POINTS_TRANSACTION_URL = '/api/points/transactions/' + globalUser?.user_id;
            const pointsTransactionResponse = await ApiClient.get<PointsTransactionResponse>(POINTS_TRANSACTION_URL) as AxiosResponse<PointsTransactionResponse>;
            if (pointsTransactionResponse.data.header.responseCode === 200) {
                setTransactions(pointsTransactionResponse.data.response);
            } else {
                console.log(pointsTransactionResponse.data.header.responseMessage || 'Failed to fetch transactions');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderTransaction = ({ item }: { item: PointsTransaction }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
                <Icon
                    name={(item.transaction_type === 'participation' || item.transaction_type === 'winner' || item.transaction_type === 'correct_answer') ? 'arrow-up' : 'arrow-down'}
                    size={24}
                    color={(item.transaction_type === 'participation' || item.transaction_type === 'winner' || item.transaction_type === 'correct_answer') ? '#4CAF50' : '#F44336'}
                />
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionComment}>
                        {item.description
                            .replace(/participation/gi, 'Participation')
                            .replace(/correct_answer/gi, 'Correct Answer')
                            .replace(/winner/gi, 'Winning')}
                    </Text>
                    <Text style={styles.transactionDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
            </View>
            <Text style={[styles.transactionAmount, { color: (item.transaction_type === 'participation' || item.transaction_type === 'winner' || item.transaction_type === 'correct_answer') ? '#4CAF50' : '#F44336' }]}>
                {(item.transaction_type === 'participation' || item.transaction_type === 'winner' || item.transaction_type === 'correct_answer') ? '+' : '-'}
                {item.points}
            </Text>
        </View>
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
                <Text style={styles.title}>My Points</Text>
            </View>

            <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Icon name="star" size={24} color="#4CAF50" style={{ marginRight: 8 }} />
                    <Text style={styles.balanceAmount}>{pointsBalance !== null ? pointsBalance : '0'}</Text>
                </View>
            </View>

            <View style={styles.transactionsContainer}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <FlatList
                    data={transactions}
                    renderItem={renderTransaction}
                    keyExtractor={(item) => item.transaction_id}
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
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    balanceContainer: {
        backgroundColor: theme.colors.white,
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        marginTop: 20,
    },
    balanceLabel: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    transactionsContainer: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.primary,
        marginBottom: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginStart: 8,
        marginEnd: 8,
    },
    transactionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionDetails: {
        marginLeft: 12,
    },
    transactionComment: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.text,
    },
    transactionDate: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
});

