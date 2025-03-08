import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Platform,
    useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import Icon from '@react-native-vector-icons/ionicons';
import { theme } from '../constants/theme';

type CategoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;

export default function CategoryScreen() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation<CategoryScreenNavigationProp>();
    const { width: screenWidth } = useWindowDimensions();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://192.168.0.21:3000/api/categories/');
                const data = await response.json();

                if (data.header.responseCode === 200) {
                    setCategories(data.response.filter((category: any) => category.use_flag)); // Only use active categories
                } else {
                    setError(data.header.responseMessage || 'Failed to fetch categories.');
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.error('Error message:', err.message);
                } else {
                    console.error('Unknown error occurred:', err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getGridDimensions = () => {
        const itemsPerRow = screenWidth > 600 ? 4 : 3;
        const totalHorizontalPadding = theme.spacing.lg * 2;
        const totalGapSpace = (itemsPerRow - 1) * theme.spacing.md;
        const availableWidth = screenWidth - totalHorizontalPadding - totalGapSpace;
        const itemWidth = availableWidth / itemsPerRow;
        return {
            itemWidth,
            spacing: theme.spacing.md
        };
    };

    const { itemWidth, spacing } = getGridDimensions();
    const iconSize = Math.min(itemWidth * 0.4, 32);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.loaderContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.title}>Quiz Categories</Text>
                    <Text style={styles.subtitle}>Choose a category to start your quiz</Text>
                </View>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="close" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.categoriesContainer}>
                    {categories.map((category: any) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.categoryButton,
                                {
                                    width: itemWidth,
                                    marginBottom: spacing
                                }
                            ]}
                            onPress={() => navigation.navigate('Quiz', { categoryId: category.category_name })}
                        >
                            <View
                                style={[
                                    styles.categoryIcon,
                                    {
                                        backgroundColor: category.color,
                                        width: iconSize * 1.75,
                                        height: iconSize * 1.75,
                                        borderRadius: iconSize * 0.875
                                    }
                                ]}
                            >
                                <Icon
                                    name={category.icon}
                                    size={iconSize}
                                    color="#FFFFFF"
                                />
                            </View>
                            <View style={styles.categoryNameContainer}>
                                <Text
                                    style={[
                                        styles.categoryName,
                                        {
                                            fontSize: Math.min(itemWidth * 0.13, 13),
                                        }
                                    ]}
                                    numberOfLines={2}
                                    adjustsFontSizeToFit
                                >
                                    {category.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: Platform.OS === 'ios' ? theme.spacing.md : theme.spacing.lg,
    },
    headerContent: {
        flex: 1,
        paddingVertical: theme.spacing.md,
    },
    title: {
        fontSize: Platform.OS === 'ios' ? 28 : 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: Platform.OS === 'ios' ? 16 : 14,
        color: theme.colors.textSecondary,
    },
    closeButton: {
        padding: theme.spacing.sm,
        marginTop: theme.spacing.sm,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: theme.spacing.lg,
    },
    categoryButton: {
        aspectRatio: 0.9,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: theme.spacing.sm,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    categoryIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    categoryNameContainer: {
        width: '100%',
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    categoryName: {
        fontWeight: '600',
        color: theme.colors.primary,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 16,
    },
});
