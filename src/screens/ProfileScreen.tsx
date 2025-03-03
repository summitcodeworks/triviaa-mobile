import React, {useState, useEffect} from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Image,
	SafeAreaView,
	ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {theme} from '../constants/theme';
import {useCoins} from '../context/CoinContext';
import type {RootStackScreenProps, TabScreenProps} from '../types/navigation.ts';
import ApiClient from "../utils/apiClient.ts";
import {StorageUtils} from "./UserDetailsScreen.tsx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserStorageService} from "../service/user-storage.service.ts";
import {UserData} from "../models/UserData.ts";
import {globalUser} from "../context/UserContext.tsx";
import {ProfileResponse} from "../models/ProfileResponse.ts";
import {AxiosResponse} from "axios";

export default function ProfileScreen({navigation}: TabScreenProps<'Profile'>) {
	const userStorage = new UserStorageService();
	const {coins} = useCoins();
	const [profileData, setProfileData] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState<UserData | null>(null);

	useEffect(() => {
		const getUser = async () => {
			setLoading(true);
			try {
				const userData = await userStorage.getUser();
				setUser(userData);
				setTimeout(() => {
					fetchProfileData();
				}, 1000);
			} catch (error) {
				console.error('Failed to fetch user:', error);
			} finally {
				setLoading(false);
			}
		};

		getUser();
	}, []);


	const fetchProfileData = async () => {
		try {
			const PROFILE_URL = '/api/users/profile/' + globalUser?.user_id;
			const response = await ApiClient.get<ProfileResponse>(PROFILE_URL) as AxiosResponse<ProfileResponse>;
			if (response.data.header.responseCode === 200) {
				setProfileData(response.data.response);
			}
		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			setLoading(false);
		}
	};

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
		cat => cat.category_name,
	);
	const categoryAccuracy = profileData.category_stats.map(cat => cat.accuracy);

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
		.filter(cat => cat.total_quizzes_played > 0)
		.sort((a, b) => b.accuracy - a.accuracy);

	// Get categories grouped by performance
	const topPerformers = activeCategories.filter(cat => cat.accuracy >= 70);
	const goodPerformers = activeCategories.filter(
		cat => cat.accuracy >= 40 && cat.accuracy < 70,
	);
	const needsImprovement = activeCategories.filter(cat => cat.accuracy < 40);

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
								name={category.category_icon.replace('-outline', '')}
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
			<ScrollView style={styles.content}>
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
							style={styles.settingsIcon}
						>
							<Icon name="settings" size={24} color={theme.colors.primary} />
						</TouchableOpacity>
					</View>



					<View style={styles.stats}>
						<View style={styles.statItem}>
							<Text style={styles.statNumber}>
								{profileData.category_stats.reduce(
									(sum, cat) => sum + cat.total_wins,
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
									(sum, cat) => sum + cat.total_losses,
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
							<Text style={styles.statNumber}>{profileData.total_points || 0}</Text>
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
		shadowOffset: {width: 0, height: 2},
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
		shadowOffset: {width: 0, height: 2},
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
		shadowOffset: {width: 0, height: 2},
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
		shadowOffset: {width: 0, height: 2},
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
});
