import { useState } from "react"
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { BackIcon } from "../components/ui/icon"
import type { RootStackScreenProps } from "../types/navigation"

export default function EmailVerificationScreen({ navigation }: RootStackScreenProps<"EmailVerification">) {
	const [verificationCode, setVerificationCode] = useState("")

	const handleBack = () => {
		navigation.goBack()
	}

	const handleSendCode = () => {
		// TODO: Implement send verification code logic
		console.log("Sending verification code")
	}

	const handleVerify = () => {
		// TODO: Implement verification logic
		console.log("Verifying code:", verificationCode)
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack} style={styles.backButton}>
					<BackIcon size={24} color="#000" />
				</TouchableOpacity>
				<Text variant="title" style={styles.headerTitle}>
					Email Verification
				</Text>
			</View>
			<View style={styles.content}>
				<Card style={styles.card}>
					<CardContent>
						<Text variant="body" style={styles.description}>
							Verify your email address to secure your account.
						</Text>
						<Button onPress={handleSendCode} style={styles.button}>
							Send Verification Code
						</Button>
						<Input
							placeholder="Enter verification code"
							value={verificationCode}
							onChangeText={setVerificationCode}
							style={styles.input}
						/>
						<Button onPress={handleVerify} style={styles.button}>
							Verify
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
		marginVertical: 16,
	},
	button: {
		width: "100%",
		marginBottom: 16,
	},
})

