import type React from "react"
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from "react-native"

interface TextProps extends RNTextProps {
    variant?: "default" | "heading" | "subheading" | "body" | "caption" | "title"
}

export const Text: React.FC<TextProps> = ({ variant = "default", style, ...props }) => {
    return <RNText style={[styles[variant], style]} {...props} />
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        color: "#000",
        fontFamily: "System",
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#000",
        letterSpacing: -1,
    },
    heading: {
        fontSize: 24,
        fontWeight: "700",
        color: "#000",
        letterSpacing: -0.5,
    },
    subheading: {
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
    },
    body: {
        fontSize: 16,
        color: "#333",
    },
    caption: {
        fontSize: 14,
        color: "#666",
    },
})

