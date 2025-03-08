import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import FAIcon from '@react-native-vector-icons/fontawesome5';
import type { RootStackScreenProps } from '../types/navigation';
import { theme } from '../constants/theme';
import { InterstitialAd, AdEventType, BannerAd, TestIds } from 'react-native-google-mobile-ads';
import RazorpayCheckout from 'react-native-razorpay';

interface CoinPackage {
    id: string
    coins: number
    price: number
}

const exchangeRate = 86.254712;

const coinPackages: CoinPackage[] = [
    { id: '1', coins: 100, price: (0.99 * exchangeRate).toFixed(0) },
    { id: '2', coins: 500, price: (4.99 * exchangeRate).toFixed(0) },
    { id: '3', coins: 1000, price: (9.99 * exchangeRate).toFixed(0) },
    { id: '4', coins: 5000, price: (49.99 * exchangeRate).toFixed(0) },
].map(pkg => ({ ...pkg, price: Number(pkg.price) })); // Ensure prices are numbers

export default function AddCoinsScreen({ navigation }: RootStackScreenProps<'AddCoins'>) {
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

    const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

    useEffect(() => {
        const loadAd = async () => {
            interstitial.load();
        };
        loadAd();
        const unsubscribeOnAdClosed = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            console.log('Interstitial ad loaded');
        });
        const unsubscribeOnAdFailed = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
            console.log('Interstitial ad failed to load', error);
        });

        return () => {
            unsubscribeOnAdClosed();
            unsubscribeOnAdFailed();
        };
    }, [interstitial]);

    const handleWatchAd = async () => {
        try {
            interstitial.load();
            await interstitial.show();
            const coinsToCredit = 10;
            const requestBody = {
                user_id: 3,
                amount: coinsToCredit,
                comment: 'By watching an ad',
            };

            const handlePurchaseUrl = 'http://192.168.0.21:3000/api/coins/credit';
            console.log('handlePurchaseUrl:', handlePurchaseUrl);
            console.log('Request body:', requestBody);

            const response = await fetch(handlePurchaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();
            console.log('Response:', responseData);

            if (response.ok && responseData.header.responseCode === 201) {
                Alert.alert('Success', 'Coins credited successfully!');
            } else {
                Alert.alert('Error', responseData.header.responseMessage || 'Something went wrong');
            }
        } catch (error) {
            console.log('Error showing ad:', error);
            Alert.alert('Error', 'Failed to show ad or credit coins. Please try again.');
        }
    };

    const handlePurchase = async () => {
        if (selectedPackage) {
            const packageToPurchase = coinPackages.find((pkg) => pkg.id === selectedPackage);
            if (packageToPurchase) {
                Alert.alert(
                    'Purchase',
                    `You are about to purchase ${packageToPurchase.coins} coins for ₹${packageToPurchase.price}`,
                );

                const options = {
                    description: 'Coin purchase',
                    image: 'https://firebasestorage.googleapis.com/v0/b/summitcodeworks.firebasestorage.app/o/logo.png?alt=media&token=4dac70a3-bd8d-4778-a838-9bd189afa057',
                    currency: 'INR',
                    key: 'rzp_live_e1IQaCf7ft3RLz',
                    amount: packageToPurchase.price * 100,
                    name: 'Triviaa',
                    prefill: {
                        email: 'user@example.com',
                        contact: '9999999999',
                        name: 'Test User',
                    },
                    theme: { color: '#F37254' },
                };

                try {
                    const response = await RazorpayCheckout.open(options);
                    console.log('Payment successful:', response);

                    // After successful payment, credit the coins
                    const requestBody = {
                        user_id: 3, // Example user_id
                        amount: packageToPurchase.coins, // Amount of coins
                        comment: 'By purchasing a coin package',
                    };

                    const handlePurchaseUrl = 'http://192.168.0.21:3000/api/coins/credit';
                    const res = await fetch(handlePurchaseUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });

                    const resData = await res.json();
                    if (res.ok && resData.header.responseCode === 201) {
                        Alert.alert('Success', 'Coins credited successfully!');
                    } else {
                        Alert.alert('Error', resData.header.responseMessage || 'Something went wrong');
                    }
                } catch (error) {
                    console.log('Payment failed:', error);
                    Alert.alert('Error', 'Payment failed. Please try again.');
                }
            }
        } else {
            Alert.alert('Select Package', 'Please select a coin package to purchase');
        }
    };

    const renderCoinPackage = ({ item }: { item: CoinPackage }) => (
        <TouchableOpacity
            style={[styles.packageItem, selectedPackage === item.id && styles.selectedPackage]}
            onPress={() => setSelectedPackage(item.id)}
        >
            <Icon name="coins" size={24} color="#FFD700" />
            <Text style={styles.packageCoins}>{item.coins} coins</Text>
            <Text style={styles.packagePrice}>₹{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft color={theme.colors.primary} size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Add Coins</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.watchAdButton} onPress={handleWatchAd}>
                    <Icon name="play-circle" size={24} color="#ffffff" style={styles.adIcon} />
                    <Text style={styles.watchAdButtonText}>Watch Ad to Earn Coins</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Or Purchase Coin Packages</Text>

                <FlatList
                    data={coinPackages}
                    renderItem={renderCoinPackage}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.packageRow}
                />

                <TouchableOpacity
                    style={[styles.purchaseButton, !selectedPackage && styles.disabledButton]}
                    onPress={handlePurchase}
                    disabled={!selectedPackage}
                >
                    <Text style={styles.purchaseButtonText}>Purchase Selected Package</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    watchAdButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    adIcon: {
        marginRight: 8,
    },
    watchAdButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 16,
    },
    packageRow: {
        justifyContent: 'space-between',
    },
    packageItem: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedPackage: {
        borderColor: theme.colors.primary,
        borderWidth: 2,
    },
    packageCoins: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginTop: 8,
    },
    packagePrice: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
    },
    purchaseButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    disabledButton: {
        opacity: 0.5,
    },
    purchaseButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
});

