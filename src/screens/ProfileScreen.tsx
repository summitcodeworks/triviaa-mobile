import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  ToastAndroid,
  Platform,
  Animated,
  Modal,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import { theme } from '../constants/theme';
import { useCoins } from '../context/CoinContext';
import type { TabScreenProps } from '../types/navigation.ts';
import ApiClient from '../utils/apiClient.ts';
import { UserStorageService } from '../service/user-storage.service.ts';
import { UserData } from '../models/UserData.ts';
import { globalUser, getGlobalUser } from '../context/UserContext.tsx';
import { ProfileResponse, ProfileData, CategoryStats } from '../models/ProfileResponse.ts';
import { AxiosResponse } from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }: TabScreenProps<'Profile'>) {
  const userStorage = useMemo(() => new UserStorageService(), []);
  const { coins } = useCoins(); // Keep this for future use
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useState(new Animated.Value(0))[0];
  const [isPolling, setIsPolling] = useState(false);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Show toast notification for iOS
  useEffect(() => {
    if (showToast) {
      Animated.sequence([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowToast(false);
      });
    }
  }, [showToast, toastOpacity]);

  const showRefreshToast = useCallback(() => {
    if (Platform.OS === 'android') {
      ToastAndroid.show('Profile refreshed', ToastAndroid.SHORT);
    } else {
      setShowToast(true);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    
    setIsPolling(true);
    setShowRetryDialog(true);
    setRetryCount(0);
    
    pollingInterval.current = setInterval(() => {
      console.log('Polling for profile data...');
      setRetryCount(prev => prev + 1);
      fetchProfileData();
    }, 3000); // Poll every 3 seconds
  }, [fetchProfileData]);

  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    setIsPolling(false);
    setShowRetryDialog(false);
  }, []);

  const fetchProfileData = useCallback(async (retryCount = 0) => {
    try {
      const currentGlobalUser = getGlobalUser();
      if (!currentGlobalUser?.user_id) {
        console.error('Global user data not available');
        setLoading(false);
        return;
      }
      
      console.log('Fetching profile data for user:', currentGlobalUser.user_id);
      const PROFILE_URL = '/api/users/profile/' + currentGlobalUser.user_id;
      const response = (await ApiClient.get<ProfileResponse>(
        PROFILE_URL,
      )) as AxiosResponse<ProfileResponse>;
      
      if (response.data.header.responseCode === 200) {
        console.log('Profile data fetched successfully');
        setProfileData(response.data.response);
        if (refreshing) {
          showRefreshToast();
        }
        stopPolling(); // Stop polling on success
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // Start polling if not already polling
      if (!isPolling) {
        startPolling();
      }
    } finally {
      if (retryCount === 0) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [refreshing, showRefreshToast, setLoading, setProfileData, setRefreshing, isPolling, startPolling, stopPolling]);

  const getUser = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await userStorage.getUser();
      setUser(userData);
      await fetchProfileData();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setLoading(false);
    }
  }, [userStorage, fetchProfileData, setLoading, setUser]);

  // Check if globalUser is ready
  useEffect(() => {
    const checkGlobalUser = async () => {
      if (!globalUser) {
        // Wait a bit and check again
        const checkInterval = setInterval(() => {
          if (globalUser) {
            clearInterval(checkInterval);
          }
        }, 500);

        // Set a timeout to prevent infinite checking
        setTimeout(() => {
          clearInterval(checkInterval);
        }, 5000);
      } else {
      }
    };

    checkGlobalUser();
  }, []);

  // Add focus effect to reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (globalUser?.user_id) {
        console.log('Profile screen focused, reloading data...');
        fetchProfileData();
      }
    }, [fetchProfileData])
  );

  // Load user data once globalUser is ready
  useEffect(() => {
    console.log('ProfileScreen globalUser changed: ', globalUser?.user_id);
    if (globalUser?.user_id) {
      getUser();
    }
  }, [globalUser, getUser]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProfileData();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProfileData]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Failed to load profile data</Text>
      </View>
    );
  }

  // Prepare data for the line graph
  const categoryLabels = profileData.category_stats.map(
    (cat: CategoryStats) => cat.category_name,
  );
  const categoryAccuracy = profileData.category_stats.map((cat: CategoryStats) => cat.accuracy);

  const lineChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryAccuracy,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Line color
        strokeWidth: 2, // Line width
      },
    ],
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings'); // Navigate to the Settings screen
  };

  // Get categories with activity (more than 0 quizzes played)
  const activeCategories = profileData.category_stats
    .filter((cat: CategoryStats) => cat.total_quizzes_played > 0)
    .sort((a: CategoryStats, b: CategoryStats) => b.accuracy - a.accuracy);

  // Get categories grouped by performance
  const topPerformers = activeCategories.filter((cat: CategoryStats) => cat.accuracy >= 70);
  const goodPerformers = activeCategories.filter(
    (cat: CategoryStats) => cat.accuracy >= 40 && cat.accuracy < 70,
  );
  const needsImprovement = activeCategories.filter((cat: CategoryStats) => cat.accuracy < 40);

  const renderCategorySection = (
    categories: CategoryStats[],
    title: string,
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {categories.map(category => (
        <View key={category.category_id} style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <View style={styles.categoryInfo}>
              <Icon
                name={category.category_icon.replace('-outline', '') as any}
                size={24}
                color={category.category_color}
                style={styles.categoryIcon}
              />
              <Text style={styles.categoryTitle}>{category.category_name}</Text>
            </View>
            <Text style={styles.accuracyText}>
              {category.accuracy}% accuracy
            </Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>
                {category.total_quizzes_played}
              </Text>
              <Text style={styles.statsLabel}>Quizzes</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>{category.total_wins}</Text>
              <Text style={styles.statsLabel}>Wins</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>
                {category.total_correct_answers}
              </Text>
              <Text style={styles.statsLabel}>Correct</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>
                {category.total_incorrect_answers}
              </Text>
              <Text style={styles.statsLabel}>Incorrect</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderReportsSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Reports</Text>
      {profileData.reports.map(report => (
        <View key={report.report_entry_id} style={styles.reportCard}>
          <Text style={styles.reportText}>
            <Text style={styles.boldText}>Question ID:</Text>{' '}
            {report.question_id}
          </Text>
          <Text style={styles.reportText}>
            <Text style={styles.boldText}>Comments:</Text>{' '}
            {report.report_comments || 'No comments'}
          </Text>
          <Text style={styles.reportText}>
            <Text style={styles.boldText}>Date:</Text>{' '}
            {new Date(report.report_date).toLocaleDateString()}
          </Text>
          <View style={styles.statusContainer}>
            <Text style={styles.boldText}>Status:</Text>
            <View
              style={[
                styles.statusBadge,
                report.resolved_flag
                  ? styles.resolvedBadge
                  : styles.pendingBadge,
              ]}>
              <Text style={styles.statusText}>
                {report.resolved_flag ? 'Resolved' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image
              source={
                profileData.user_photo_url
                  ? { uri: profileData.user_photo_url }
                  : { uri: 'https://i.pravatar.cc/100' }
              }
              style={styles.avatar}
            />
            <Text style={styles.name}>{profileData.user_name}</Text>
            <Text style={styles.level}>
              Level {Math.floor(profileData.total_points / 100)} Quiz Master
            </Text>

            <TouchableOpacity
              onPress={handleSettingsPress}
              style={styles.settingsIcon}>
              <Icon name="settings" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData.category_stats.reduce(
                  (sum: number, cat: CategoryStats) => sum + cat.total_wins,
                  0,
                )}
              </Text>
              {/*<Icon name="trophy" size={20} color={theme.colors.primary} />*/}
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData.category_stats.reduce(
                  (sum: number, cat: CategoryStats) => sum + cat.total_losses,
                  0,
                )}
              </Text>
              {/*<FAIcon name="sad" size={20} color={theme.colors.primary} />*/}
              <Text style={styles.statLabel}>Losses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData.total_quizzes_played}
              </Text>
              {/*<FAIcon name="help-circle" size={20} color={theme.colors.primary} />*/}
              <Text style={styles.statLabel}>Quizzes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.accuracy}%</Text>
              {/*<FAIcon name="checkmark-circle" size={20} color={theme.colors.primary} />*/}
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profileData.total_points || 0}
              </Text>
              {/*<FAIcon name="star" size={20} color={theme.colors.primary} />*/}
              <Text style={styles.statLabel}>Points</Text>
            </View>
          </View>
        </View>

        {/* Line Graph */}
        {/*<View style={styles.section}>*/}
        {/*    <Text style={styles.sectionTitle}>Category-wise Performance</Text>*/}
        {/*    <LineChart*/}
        {/*        data={lineChartData}*/}
        {/*        width={350}*/}
        {/*        height={220}*/}
        {/*        yAxisLabel="%"*/}
        {/*        yAxisSuffix=""*/}
        {/*        chartConfig={{*/}
        {/*            backgroundColor: theme.colors.white,*/}
        {/*            backgroundGradientFrom: theme.colors.white,*/}
        {/*            backgroundGradientTo: theme.colors.white,*/}
        {/*            decimalPlaces: 0,*/}
        {/*            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,*/}
        {/*            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,*/}
        {/*            style: {*/}
        {/*                borderRadius: 16,*/}
        {/*            },*/}
        {/*            propsForDots: {*/}
        {/*                r: '4',*/}
        {/*                strokeWidth: '2',*/}
        {/*                stroke: theme.colors.primary,*/}
        {/*            },*/}
        {/*        }}*/}
        {/*        bezier // Smooth curve*/}
        {/*        style={styles.chart}*/}
        {/*    />*/}
        {/*</View>*/}

        {topPerformers.length > 0 &&
          renderCategorySection(topPerformers, 'Top Performance (70%+)')}
        {goodPerformers.length > 0 &&
          renderCategorySection(goodPerformers, 'Good Performance (40-70%)')}
        {needsImprovement.length > 0 &&
          renderCategorySection(needsImprovement, 'Needs Improvement (<40%)')}

        {/* Reports Section */}
        {profileData.reports.length > 0 && renderReportsSection()}
      </ScrollView>

      {/* Retry Dialog */}
      <Modal
        visible={showRetryDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRetryDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.modalTitle}>Retrying to load profile...</Text>
            <Text style={styles.modalText}>
              Attempt {retryCount + 1}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                stopPolling();
                setShowRetryDialog(false);
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* iOS Toast */}
      {Platform.OS === 'ios' && showToast && (
        <Animated.View style={[styles.iosToast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>Profile refreshed</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative', // Needed for absolute positioning of the icon
  },
  settingsIcon: {
    position: 'absolute', // Position the icon absolutely
    top: 0, // Align to the top
    right: 0, // Align to the right
    padding: theme.spacing.sm, // Add padding for better touchability
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  level: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5E5',
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  categoryCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    marginRight: theme.spacing.md,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  accuracyText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  statsItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  reportCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  boldText: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  chart: {
    marginVertical: theme.spacing.md,
    borderRadius: 16,
    alignSelf: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 4,
    marginLeft: theme.spacing.sm,
  },
  resolvedBadge: {
    backgroundColor: '#4CAF50', // Green for resolved
  },
  pendingBadge: {
    backgroundColor: '#FFC107', // Yellow for pending
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.white,
  },
  iosToast: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: theme.colors.white,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
