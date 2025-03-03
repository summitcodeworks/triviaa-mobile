import type React from "react"
import { View, StyleSheet } from "react-native"
import { Text } from "./text"

interface BadgeProps {
    variant?: "default" | "success" | "destructive"
    children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", children }) => {
    return (
        <View style={[styles.badge, styles[variant]]}>
            <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    default: {
        backgroundColor: "#f1f1f1",
    },
    success: {
        backgroundColor: "#e8f5e9",
    },
    destructive: {
        backgroundColor: "#ffebee",
    },
    text: {
        fontSize: 12,
        fontWeight: "600",
    },
    defaultText: {
        color: "#000",
    },
    successText: {
        color: "#2e7d32",
    },
    destructiveText: {
        color: "#c62828",
    },
})

