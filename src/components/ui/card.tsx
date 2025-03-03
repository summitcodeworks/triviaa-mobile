import type React from "react"
import { View, StyleSheet, type ViewProps } from "react-native"

export const Card: React.FC<ViewProps> = ({ style, ...props }) => {
    return <View style={[styles.card, style]} {...props} />
}

export const CardHeader: React.FC<ViewProps> = ({ style, ...props }) => {
    return <View style={[styles.cardHeader, style]} {...props} />
}

export const CardContent: React.FC<ViewProps> = ({ style, ...props }) => {
    return <View style={[styles.cardContent, style]} {...props} />
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginVertical: 8,
    },
    cardHeader: {
        padding: 16,
    },
    cardContent: {
        padding: 16,
    },
})

