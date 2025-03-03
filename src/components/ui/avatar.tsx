import type React from "react"
import { View, Image, StyleSheet } from "react-native"
import { Text } from "./text"

interface AvatarProps {
    src?: string
    fallback?: string
    size?: number
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, size = 40 }) => {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            {src ? <Image source={{ uri: src }} style={styles.image} /> : <Text style={styles.fallback}>{fallback}</Text>}
        </View>
    )
}

export const AvatarImage: React.FC<{ src: string }> = ({ src }) => {
    return <Image source={{ uri: src }} style={styles.image} />
}

export const AvatarFallback: React.FC<{ children: string }> = ({ children }) => {
    return <Text style={styles.fallback}>{children}</Text>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E9E9EB",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    fallback: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#007AFF",
    },
})

