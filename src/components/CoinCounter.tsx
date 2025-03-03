import type React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import type { CoinCounterProps } from '../types/coinCounter.ts'

export const CoinCounter: React.FC<CoinCounterProps> = ({ coins }) => {
    return (
        <View style={styles.container}>
            <Icon name="coin" size={24} color="#FFD700" />
            <Text style={styles.coinText}>{coins}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.1)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    coinText: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
})

