import type React from "react"
import { View, StyleSheet } from "react-native"

interface ProgressProps {
    value: number
    className?: string
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => {
    return (
        <View style={[styles.container, className]}>
            <View style={[styles.bar, { width: `${value}%` }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 8,
        backgroundColor: "#E9E9EB",
        borderRadius: 4,
        overflow: "hidden",
    },
    bar: {
        height: "100%",
        backgroundColor: "#007AFF",
    },
})

