import type React from "react"
import { TouchableOpacity, StyleSheet, type TouchableOpacityProps } from "react-native"
import { Text } from "./text"

interface ButtonProps extends TouchableOpacityProps {
    variant?: "primary" | "secondary" | "outline"
    size?: "sm" | "md" | "lg"
    children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", size = "md", style, ...props }) => {
    return (
        <TouchableOpacity style={[styles.button, styles[variant], styles[size], style]} {...props}>
            <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}>{children}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    primary: {
        backgroundColor: "#000",
    },
    secondary: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e1e1e1",
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#000",
    },
    sm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    md: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    lg: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
    primaryText: {
        color: "#fff",
    },
    secondaryText: {
        color: "#000",
    },
    outlineText: {
        color: "#000",
    },
    smText: {
        fontSize: 14,
    },
    mdText: {
        fontSize: 16,
    },
    lgText: {
        fontSize: 18,
    },
})

