import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants/theme';
import type { RootStackScreenProps } from '../types/navigation';
import {UserStorageService} from "../service/user-storage.service.ts";
import {UserData} from "../models/UserData.ts";
import ApiClient from "../utils/apiClient.ts";
import {globalUser} from "../context/UserContext.tsx";

interface RecentGame {
    session_id: string
    user_id: string
    category: string
    category_name: string
    start_time: string
    end_time: string
    correct_answers: number
    total_questions: number
    icon: string
    color: string
    description: string
    coins_earned: number
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const calculateTimePlayed = (start: string, end: string) => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diffInSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    return `${minutes}m ${seconds}s`;
};

export default function RecentlyPlayedScreen({ navigation }: RootStackScreenProps<'RecentlyPlayed'>) {
    const userStorage= new UserStorageService()
    const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const userData = await userStorage.getUser();
                setUser(userData);
                fetchRecentGames();
            } catch (error) {
                console.error('Failed to fetch user data ' + error);
            } finally {
                setLoading(false);
            }
        }
        getUser();
    }, []);

    const fetchRecentGames = async () => {
        try {
            const RECENT_GAMES_URL = '/api/quiz/recent-games/' + globalUser?.user_id;
            const response = await ApiClient.get(RECENT_GAMES_URL);;
            if (response.data.header.responseCode === 200) {
                setRecentGames(response.data.response);
            } else {
                console.log('Error fetching recent games:', response.data.header.responseMessage);
            }
        } catch (error) {
            console.log('Error fetching recent games:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderRecentGame = ({ item }: { item: RecentGame }) => (
        <TouchableOpacity
            style={styles.recentCard}
            onPress={() => navigation.navigate('Quiz', { categoryId: item.category_name })}
        >
            <View style={styles.recentInfo}>
                <Icon name={item.icon} size={32} color="#000000" style={styles.recentIcon} />
                <View style={styles.gameDetails}>
                    <Text style={styles.recentTitle} numberOfLines={1}>
                        {item.category}
                    </Text>
                    <Text style={styles.recentDate} numberOfLines={1}>
                        {formatDate(item.start_time)}
                    </Text>
                    <Text style={styles.recentTime} numberOfLines={1}>
                        Time: {calculateTimePlayed(item.start_time, item.end_time)}
                    </Text>
                </View>
            </View>
            <View style={styles.recentScore}>
                <Text style={styles.scoreText}>
                    {item.correct_answers} / {item.total_questions}
                </Text>
                <Text style={styles.coinsEarned}>+{item.correct_answers === 10 ? '10' : '0'} coins</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft color={theme.colors.primary} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Recently Played</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
            ) : (
                <FlatList
                    data={recentGames}
                    renderItem={renderRecentGame}
                    keyExtractor={(item) => item.session_id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.noGamesText}>No recent games played</Text>}
                />
            )}
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
    backButton: {
        marginRight: theme.spacing.md,
    },
    listContent: {
        padding: theme.spacing.lg,
    },
    recentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.lg,
        borderRadius: 12,
        marginBottom: theme.spacing.md,
        marginHorizontal: theme.spacing.sm,
    },
    recentInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    recentIcon: {
        marginRight: theme.spacing.md,
    },
    gameDetails: {
        flex: 1,
        paddingRight: theme.spacing.md,
    },
    recentScore: {
        alignItems: 'flex-end',
        minWidth: 70,
        marginLeft: theme.spacing.md,
    },
    scoreText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
        marginBottom: 4,
    },
    coinsEarned: {
        fontSize: 12,
        color: theme.colors.success,
        marginBottom: 4,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noGamesText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.xl,
    },
    recentTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.primary,
        marginBottom: 4,
    },
    recentDate: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    recentTime: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
});

