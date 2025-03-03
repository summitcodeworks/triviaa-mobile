import { useState } from "react"
import { View, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { Switch } from "../components/ui/switch"
import { BackIcon } from "../components/ui/icon"
import type { RootStackScreenProps } from "../types/navigation"

export default function PrivacySettingsScreen({ navigation }: RootStackScreenProps<"PrivacySettings">) {
	const [showProfile, setShowProfile] = useState(true)
	const [shareActivity, setShareActivity] = useState(false)
	const [allowDataCollection, setAllowDataCollection] = useState(true)

	const handleBack = () => {
		navigation.goBack()
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack} style={styles.backButton}>
					<BackIcon size={24} color="#000" />
				</TouchableOpacity>
				<Text variant="title" style={styles.headerTitle}>
					Privacy Settings
				</Text>
			</View>
			<ScrollView style={styles.content}>
				<Card style={styles.card}>
					<CardContent>
						<View style={styles.settingItem}>
							<Text variant="body">Show Profile to Others</Text>
							<Switch value={showProfile} onValueChange={setShowProfile} />
						</View>
						<View style={styles.settingItem}>
							<Text variant="body">Share Activity</Text>
							<Switch value={shareActivity} onValueChange={setShareActivity} />
						</View>
						<View style={styles.settingItem}>
							<Text variant="body">Allow Data Collection</Text>
							<Switch value={allowDataCollection} onValueChange={setAllowDataCollection} />
						</View>
					</CardContent>
				</Card>
			</ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#fff",
	},
	backButton: {
		marginRight: 16,
	},
	headerTitle: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	card: {
		marginBottom: 20,
	},
	settingItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
	},
})

