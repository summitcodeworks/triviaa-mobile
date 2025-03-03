import { useState } from "react"
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { BackIcon } from "../components/ui/icon"
import type { RootStackScreenProps } from "../types/navigation"

export default function ChangeUsernameScreen({ navigation }: RootStackScreenProps<"ChangeUsername">) {
	const [newUsername, setNewUsername] = useState("")

	const handleBack = () => {
		navigation.goBack()
	}

	const handleSubmit = () => {
		// TODO: Implement username change logic
		console.log("Changing username to:", newUsername)
		navigation.goBack()
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack} style={styles.backButton}>
					<BackIcon size={24} color="#000" />
				</TouchableOpacity>
				<Text variant="title" style={styles.headerTitle}>
					Change Username
				</Text>
			</View>
			<View style={styles.content}>
				<Card style={styles.card}>
					<CardContent>
						<Text variant="body" style={styles.description}>
							Enter your new username below:
						</Text>
						<Input placeholder="New Username" value={newUsername} onChangeText={setNewUsername} style={styles.input} />
						<Button onPress={handleSubmit} style={styles.button}>
							Change Username
						</Button>
					</CardContent>
				</Card>
			</View>
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
	description: {
		marginBottom: 16,
	},
	input: {
		marginBottom: 16,
	},
	button: {
		width: "100%",
	},
})

