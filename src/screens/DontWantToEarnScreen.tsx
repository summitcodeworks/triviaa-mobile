import { View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { ListItem } from "../components/ui/list-item"
import { BackIcon } from "../components/ui/icon"
import type { RootStackScreenProps } from "../types/navigation"

export default function DontWantToEarnScreen({ navigation }: RootStackScreenProps<"DontWantToEarn">) {
	const handleBack = () => {
		navigation.goBack()
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBack} style={styles.backButton}>
						<BackIcon size={24} color="#000" />
					</TouchableOpacity>
					<Text variant="title" style={styles.headerTitle}>
						Don't Want to Earn
					</Text>
				</View>

				<View style={styles.content}>
					<Card style={styles.section}>
						<CardContent>
							<Text variant="body" style={styles.description}>
								When you choose not to earn, you won't receive any rewards for completing quizzes or challenges. This
								setting can be changed at any time.
							</Text>
						</CardContent>
					</Card>

					<Text variant="subheading" style={styles.sectionTitle}>
						What This Means
					</Text>

					<Card style={styles.section}>
						<CardContent>
							<ListItem title="No Coins" subtitle="You won't earn any coins for completed quizzes" />
							<ListItem title="No Rewards" subtitle="You won't be eligible for any rewards or prizes" />
							<ListItem title="Pure Learning" subtitle="Focus solely on learning without distractions" />
						</CardContent>
					</Card>
				</View>
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
		padding: 20,
	},
	section: {
		marginBottom: 24,
	},
	sectionTitle: {
		marginBottom: 12,
		paddingLeft: 4,
	},
	description: {
		marginBottom: 16,
	},
})

