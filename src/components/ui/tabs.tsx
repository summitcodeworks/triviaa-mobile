import type React from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Text } from "./text"

interface TabsProps {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
    return <View>{children}</View>
}

interface TabsListProps {
    children: React.ReactNode
}

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
    return <View style={styles.tabsList}>{children}</View>
}

interface TabsTriggerProps {
    value: string
    isActive: boolean
    onPress: () => void
    children: React.ReactNode
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, isActive, onPress, children }) => {
    return (
        <TouchableOpacity style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive]} onPress={onPress}>
            <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive]}>{children}</Text>
        </TouchableOpacity>
    )
}

interface TabsContentProps {
    value: string
    activeValue: string
    children: React.ReactNode
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, activeValue, children }) => {
    if (value !== activeValue) return null
    return <View>{children}</View>
}

const styles = StyleSheet.create({
    tabsList: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E9E9EB",
    },
    tabsTrigger: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
    },
    tabsTriggerActive: {
        borderBottomWidth: 2,
        borderBottomColor: "#007AFF",
    },
    tabsTriggerText: {
        fontSize: 16,
        color: "#000",
    },
    tabsTriggerTextActive: {
        fontWeight: "600",
        color: "#007AFF",
    },
})

