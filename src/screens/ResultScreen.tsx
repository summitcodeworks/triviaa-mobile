import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import { RootStackParamList } from '../types/navigation';
import FAIcon from '@react-native-vector-icons/fontawesome5';
import { useCoins } from './../context/CoinContext.tsx';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;

type Props = {
    route: ResultScreenRouteProp;
    navigation: ResultScreenNavigationProp;
};

export default function ResultScreen({ route, navigation }: Props) {
    const { score, total, coinsEarned, sessionId } = route.params;
    const { addCoins } = useCoins();
    const [showCelebration, setShowCelebration] = useState(false);
    const percentage = (total === 10) ? 100 : 0;
    const isWinning = percentage >= 70;

    useEffect(() => {
        if (coinsEarned > 0) {
            addCoins(coinsEarned).catch(console.error);
            if (coinsEarned === 10) {
                setShowCelebration(true);
                const timer = setTimeout(() => setShowCelebration(false), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [coinsEarned, addCoins]);

    const handleNavigateHome = useCallback(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {showCelebration && (
                    <View style={styles.animationContainer}>
                        <LottieView
                            source={require('../../assets/animations/party-popper.json')}
                            autoPlay
                            loop={false}
                            style={styles.animation}
                        />
                    </View>
                )}
                <Text style={styles.title}>{isWinning ? 'Congratulations!' : 'Nice Try!'}</Text>
                <Text style={styles.percentageText}>
                    {percentage.toFixed(1)}%
                </Text>
                <View style={styles.coinsContainer}>
                    <FAIcon
                        name="coins"
                        iconStyle="solid"
                        size={20}
                        color="#FFD700"
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.coinsText}>
                        {coinsEarned} Coins Earned
                    </Text>
                </View>
                <Text style={styles.message}>
                    {isWinning
                        ? "Great job! You've mastered this quiz."
                        : "Keep practicing and you'll improve!"}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleNavigateHome}
                >
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    animationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 0, // Set zIndex of animation container lower than the button
    },
    animation: {
        width: 300,
        height: 300,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 20,
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 20,
    },
    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    coinsText: {
        fontSize: 18,
        color: '#333',
        marginLeft: 10,
    },
    message: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#1a237e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        zIndex: 1, // Set zIndex of button higher than animation container
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
