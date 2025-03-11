import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { theme } from '../constants/theme';
import ApiClient from "../utils/apiClient.ts";
import { DEFAULT_PROFILE_PICTURE } from '../context/UserContext.tsx';

type Player = {
    user_id: string;
    user_name: string;
    user_photo_url: string | null;
    total_points: number;
    rank: number;
};

type LeaderboardResponse = {
    header: {
        responseCode: number;
        responseMessage: string;
    };
    response: Player[];
};

export default function LeaderboardScreen() {
    const [topPlayers, setTopPlayers] = useState<Player[]>([]);
    const [otherPlayers, setOtherPlayers] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const LEADERBOARD_URL = '/api/points/leaderboard?threshold=500&limit=5';
                const response = await ApiClient.get<LeaderboardResponse>(LEADERBOARD_URL);
                const leaderboardData = response.data.response;
                if (response.data.header.responseCode === 200) {
                    const sortedPlayers = leaderboardData.sort((a: Player, b: Player) => a.rank - b.rank);
                    setTopPlayers(sortedPlayers.slice(0, 3));
                    setOtherPlayers(sortedPlayers.slice(3));
                } else {
                    console.error('Failed to fetch leaderboard:', response.data.header.responseMessage);
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading Leaderboard...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Leaderboard 🔥</Text>
                <View style={styles.stats}>
                    <Text style={styles.statText}>🏆 {topPlayers.length + otherPlayers.length}</Text>
                </View>
            </View>

            <View style={styles.topPlayers}>
                {topPlayers.map((player) => (
                    <View
                        key={player.user_id}
                        style={[
                            styles.topPlayerCard,
                            player.rank === 1 && styles.topPlayerCardFirst,
                        ]}
                    >
                        <Image
                            source={{
                                uri: player.user_photo_url || DEFAULT_PROFILE_PICTURE
                            }}
                            style={styles.topPlayerAvatar}
                        />
                        <Text style={styles.topPlayerName}>{player.user_name}</Text>
                        <Text style={styles.topPlayerScore}>{player.total_points}</Text>
                        <View style={[styles.crown, player.rank === 1 && styles.crownFirst]}>
                            <Text style={styles.crownText}>{player.rank}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <ScrollView style={styles.otherPlayers}>
                {otherPlayers.map((player) => (
                    <View key={player.user_id} style={styles.playerCard}>
                        <View style={styles.playerInfo}>
                            <Text style={styles.playerPosition}>#{player.rank}</Text>
                            <Image
                                source={{
                                    uri: player.user_photo_url || DEFAULT_PROFILE_PICTURE,
                                }}
                                style={styles.playerAvatar}
                            />
                            <Text style={styles.playerName}>{player.user_name}</Text>
                        </View>
                        <Text style={styles.playerScore}>{player.total_points}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loadingText: {
        marginTop: theme.spacing.md,
        fontSize: 18,
        color: theme.colors.textSecondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statText: {
        fontSize: 16,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
    },
    topPlayers: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingVertical: theme.spacing.xl,
    },
    topPlayerCard: {
        alignItems: 'center',
        marginHorizontal: theme.spacing.md,
    },
    topPlayerCardFirst: {
        marginTop: -theme.spacing.xl,
    },
    topPlayerAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: theme.spacing.sm,
    },
    topPlayerName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
    },
    topPlayerScore: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    crown: {
        position: 'absolute',
        top: -15,
        backgroundColor: theme.colors.secondary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crownFirst: {
        backgroundColor: '#FFD700',
    },
    crownText: {
        color: theme.colors.white,
        fontWeight: '700',
        fontSize: 12,
    },
    otherPlayers: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    playerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: 12,
        marginBottom: theme.spacing.sm,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerPosition: {
        width: 30,
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    playerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: theme.spacing.md,
    },
    playerName: {
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.primary,
    },
    playerScore: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.secondary,
    },
});
