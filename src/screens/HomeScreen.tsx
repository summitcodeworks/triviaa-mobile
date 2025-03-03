import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    useWindowDimensions, ActivityIndicator,
} from 'react-native';
import {theme} from '../constants/theme';
import type {TabScreenProps} from '../types/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {ChevronRightIcon} from '../components/ui/icon.tsx';
import {UserData} from '../models/UserData.ts';
import {UserStorageService} from '../service/user-storage.service.ts';
import ApiClient from '../utils/apiClient.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import {globalUser, initializeGlobalUser} from "../context/UserContext.tsx";
import {PointsBalanceResponse} from "../models/PointsBalanceResponse.ts";
import {AxiosResponse} from "axios";
import {CoinsBalanceResponse} from "../models/CoinsBalanceResponse.ts";
import {GameSession, RecentGamesResponse} from "../models/RecentGamesResponse.ts";
import {PopularCategoriesResponse, PopularCategory} from "../models/PopularCategoriesResponse.ts";

export default function HomeScreen({navigation}: TabScreenProps<'Home'>) {
    const userStorage = new UserStorageService();
    const {width: screenWidth} = useWindowDimensions();
    const [popularGames, setPopularGames] = useState<PopularCategory[]>([]);
    const [recentGames, setRecentGames] = useState<GameSession[]>([]);
    const [coinBalance, setCoinBalance] = useState<number | null>(null);
    const [pointsBalance, setPointsBalance] = useState<number | null>(null);
    const [loadingCoins, setLoadingCoins] = useState<boolean>(true);
    const [loadingPoints, setLoadingPoints] = useState<boolean>(true);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const userData = await userStorage.getUser();
            setUser(userData);
            await initializeGlobalUser();
        };

        getUser();
    }, []);

    useEffect(() => {
        if (user) {
            fetchPopularGames();
            fetchRecentGames();
            fetchCoinBalance();
            fetchPointsBalance();
        }
    }, [user]);

    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                fetchPopularGames();
                fetchRecentGames();
                fetchCoinBalance();
                fetchPointsBalance();
            }
        }, [user])
    );

    const fetchPopularGames = async () => {
        try {
            if (!user) {
                console.error('User data not available');
                return;
            }
            const POPULAR_CATEGORIES_URL = '/api/categories/count/popular';
            const response = await ApiClient.get<PopularCategoriesResponse>(POPULAR_CATEGORIES_URL) as AxiosResponse<PopularCategoriesResponse>;
            if (response.data.header.responseCode === 200) {
                setPopularGames(response.data.response);
            } else {
                console.log('Error fetching popular games:', response.data.header.responseMessage);
            }
        } catch (error) {
            console.log('Error fetching popular games:', error);
        }
    };

    const fetchRecentGames = async () => {
        try {
            if (!user) {
                console.error('User data not available');
                return;
            }
            const RECENT_GAMES_URL = '/api/quiz/recent-games/' + globalUser?.user_id;
            const response = await ApiClient.get<RecentGamesResponse>(RECENT_GAMES_URL) as AxiosResponse<RecentGamesResponse>;
            if (response.data.header.responseCode === 200) {
                setRecentGames(response.data.response);
            } else {
                setRecentGames([]);
                console.log('Error fetching recent games:', response.data.header.responseMessage);
            }
        } catch (error) {
            console.log('Error fetching recent games:', error);
        }
    };

    const fetchCoinBalance = async () => {
        try {
            if (!user) {
                console.error('User data not available');
                return;
            }
            const COINS_BALANCES_URL = '/api/coins/balance/' + globalUser?.user_id;
            const response = await ApiClient.get<CoinsBalanceResponse>(COINS_BALANCES_URL) as AxiosResponse<CoinsBalanceResponse>;
            if (response.data.header.responseCode === 200) {
                setCoinBalance(response.data.response.coin_balance);
            } else {
                setCoinBalance(0);
                console.log('Error fetching coin balance:', response.data.header.responseMessage);
            }
        } catch (error) {
            console.log('Error fetching coin balance:', error);
        } finally {
            setLoadingCoins(false);
        }
    };

    const fetchPointsBalance = async () => {
        try {
            if (!user) {
                console.error('User data not available');
                return;
            }
            const POINTS_BALANCES_URL = '/api/points/balance/' + globalUser?.user_id;
            const response = await ApiClient.get<PointsBalanceResponse>(POINTS_BALANCES_URL) as AxiosResponse<PointsBalanceResponse>;
            console.log('fetchPointsBalance: ' + response.data.header);
            if (response.data.header.responseCode === 200) {
                setPointsBalance(response.data.response.total_points);
            } else {
                setPointsBalance(0);
                console.log('Error fetching points balance:', response.data.header.responseMessage);
            }
        } catch (error) {
            console.log('Error fetching points balance:', error);
        } finally {
            setLoadingPoints(false);
        }
    };

    const getGridDimensions = () => {
        const itemsPerRow = screenWidth > 600 ? 4 : 3;
        const totalHorizontalPadding = theme.spacing.lg * 2;
        const totalGapSpace = (itemsPerRow - 1) * theme.spacing.md;
        const availableWidth = screenWidth - totalHorizontalPadding - totalGapSpace;
        const itemWidth = availableWidth / itemsPerRow;
        return {
            itemWidth,
            spacing: theme.spacing.md,
        };
    };

    const {itemWidth} = getGridDimensions();
    const iconSize = Math.min(itemWidth * 0.4, 32);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerRow}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.title}>Quiz</Text>
                            <Icon
                                name="trophy"
                                size={24}
                                color="#FB8C00"
                                style={{ marginLeft: 12, alignItems: 'center', marginTop: theme.spacing.sm }}
                            />
                        </View>
                        <View style={styles.balanceContainer}>
                            <View style={styles.balanceIndicator}>
                                {loadingCoins ? (
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                ) : (
                                    <>
                                        <FAIcon name="coins" size={20} color="#FFD700" style={{ marginRight: 8 }} />
                                        {/*<CoinsIcon size={20} color="#999" />*/}
                                        <TouchableOpacity onPress={() => navigation.navigate('Coins')}>
                                            <Text style={styles.balanceText}>{coinBalance !== null ? coinBalance : 0}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                            <View style={styles.balanceIndicator}>
                                {loadingPoints ? (
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                ) : (
                                    <>
                                        <Icon name="star" size={20} color="#4CAF50" style={{ marginRight: 8 }} />
                                        <TouchableOpacity onPress={() => navigation.navigate('Points')}>
                                            <Text style={styles.balanceText}>{pointsBalance !== null ? pointsBalance : 0}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        </View>
                    </View>

                    <Text style={styles.subtitle}>
                        Challenge your friends with funny trivia quiz lets see who scores most and rise up to be ultimate quiz
                        champion
                    </Text>
                </View>


                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.sectionTitle}>Popular Games</Text>
                            <Icon
                                name="flame"
                                size={20}
                                color="#FF5722"
                                style={{marginLeft: 12}}
                            />
                        </View>

                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {popularGames.map(game => (
                            <TouchableOpacity
                                key={game.category_id}
                                style={[styles.gameCard, {backgroundColor: game.color}]}
                                onPress={() =>
                                    navigation.navigate('Quiz', {categoryId: game.category_name})
                                }>
                                <Icon
                                    name={game.icon}
                                    size={iconSize}
                                    color="#FFFFFF"
                                    style={styles.gameIcon}
                                />
                                <Text style={styles.gameTitle}>{game.name}</Text>
                                <Text style={styles.gameDescription}>{game.description}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recently Played</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('RecentlyPlayed')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    {recentGames.length > 0 ? (
                        recentGames.map(game => (
                            <TouchableOpacity
                                key={game.session_id}
                                style={styles.recentCard}
                                onPress={() =>
                                    navigation.navigate('Quiz', {categoryId: game.category_name})
                                }>
                                <View style={styles.recentInfo}>
                                    <Icon
                                        name={game.icon}
                                        size={iconSize}
                                        color="#000000"
                                        style={styles.recentIcon}
                                    />
                                    <Text style={styles.recentTitle}>{game.category}</Text>
                                </View>
                                <View style={styles.recentScore}>
                                    <Text style={styles.scoreText}>
                                        {game.correct_answers} / {game.total_questions}
                                    </Text>
                                    {/*<ChevronRightIcon*/}
                                    {/*    name="chevron-right"*/}
                                    {/*    size={24}*/}
                                    {/*    color={theme.colors.textSecondary}*/}
                                    {/*/>*/}
                                    <ChevronRightIcon size={20} color="#999" />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noRecentGames}>No recent games played</Text>
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.nextButton]}
                    onPress={() => navigation.navigate('Category')}>
                    <Text style={styles.nextButtonText}>Play Game</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    container: {flex: 1, backgroundColor: theme.colors.background},
    content: {flex: 1, padding: theme.spacing.lg},
    header: {marginBottom: theme.spacing.xl},
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
    },
    subtitle: {fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20},
    section: {marginBottom: theme.spacing.xl},
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    seeAll: {color: theme.colors.secondary, fontWeight: '500'},
    gameCard: {
        width: 280,
        padding: theme.spacing.lg,
        borderRadius: 16,
        marginRight: theme.spacing.md,
    },
    gameIcon: {fontSize: 32, marginBottom: theme.spacing.md},
    gameTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: theme.colors.white,
        marginBottom: theme.spacing.sm,
    },
    gameDescription: {
        fontSize: 14,
        color: theme.colors.white,
        opacity: 0.9,
        lineHeight: 20,
    },
    recentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        borderRadius: 12,
        marginBottom: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    recentInfo: {flexDirection: 'row', alignItems: 'center'},
    recentIcon: {fontSize: 24, marginRight: theme.spacing.md},
    recentTitle: {fontSize: 16, fontWeight: '500', color: theme.colors.primary},
    recentScore: {flexDirection: 'row', alignItems: 'center'},
    scoreText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginRight: theme.spacing.sm,
    },
    footer: {padding: 20},
    nextButton: {
        backgroundColor: '#1a237e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextButtonText: {color: '#ffffff', fontSize: 16, fontWeight: 'bold'},
    noRecentGames: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        paddingVertical: theme.spacing.md,
    },
    button: {
        backgroundColor: '#FF5722',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    coinIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    coinText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    balanceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    balanceIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginStart: 10,
    },
    balanceText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});
