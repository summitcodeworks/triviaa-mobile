import type React from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Text } from "./text"
import { ChevronRightIcon } from "./icon"

interface ListItemProps {
	icon?: React.ReactNode
	title: string
	subtitle?: string
	rightElement?: React.ReactNode
	onPress?: () => void
}

export const ListItem: React.FC<ListItemProps> = ({ icon, title, subtitle, rightElement, onPress }) => {
	return (
		<TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
			{icon && <View style={styles.iconContainer}>{icon}</View>}
			<View style={styles.content}>
				<Text variant="body" style={styles.title}>
					{title}
				</Text>
				{subtitle && (
					<Text variant="caption" style={styles.subtitle}>
						{subtitle}
					</Text>
				)}
			</View>
			{rightElement ? rightElement : onPress ? <ChevronRightIcon size={20} color="#999" /> : null}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#fff",
	},
	iconContainer: {
		marginRight: 12,
	},
	content: {
		flex: 1,
	},
	title: {
		fontWeight: "500",
	},
	subtitle: {
		marginTop: 2,
		color: "#666",
	},
})

