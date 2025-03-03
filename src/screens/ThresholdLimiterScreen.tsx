import { useState, useEffect } from "react"
import { View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { BackIcon } from "../components/ui/icon"
import { Button } from "../components/ui/button"
import type { RootStackScreenProps } from "../types/navigation"

export default function ThresholdLimiterScreen({ navigation }: RootStackScreenProps<"ThresholdLimiter">) {
	const [coinsToEncash, setCoinsToEncash] = useState(100)
	const [description, setDescription] = useState("")

	useEffect(() => {
		updateDescription()
	}, [coinsToEncash])

	const handleBack = () => {
		navigation.goBack()
	}

	const updateDescription = () => {
		const cashValue = coinsToEncash / 100 // Assuming 1 coin = $0.01
		setDescription(`You will receive $${cashValue.toFixed(2)} for ${coinsToEncash} coins.`)
	}

	const incrementCoins = () => {
		setCoinsToEncash((prev) => Math.min(prev + 100, 10000)) // Max 10,000 coins
	}

	const decrementCoins = () => {
		setCoinsToEncash((prev) => Math.max(prev - 100, 100)) // Min 100 coins
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<View style={styles.header}>
					<TouchableOpacity onPress={handleBack} style={styles.backButton}>
						<BackIcon size={24} color="#000" />
					</TouchableOpacity>
					<Text variant="title" style={styles.headerTitle}>
						Coin Encashment
					</Text>
				</View>

				<View style={styles.content}>
					<Text variant="body" style={styles.description}>
						Set the number of coins you want to encash. Minimum 100, maximum 10,000 coins.
					</Text>

					<Card style={styles.card}>
						<CardContent>
							<View style={styles.stepperContainer}>
								<Button onPress={decrementCoins} variant="outline" style={styles.stepperButton}>
									-
								</Button>
								<Text variant="title" style={styles.coinCount}>
									{coinsToEncash}
								</Text>
								<Button onPress={incrementCoins} variant="outline" style={styles.stepperButton}>
									+
								</Button>
							</View>
							<Text variant="body" style={styles.encashDescription}>
								{description}
							</Text>
						</CardContent>
					</Card>

					<Button onPress={() => console.log("Encash requested:", coinsToEncash)} style={styles.encashButton}>
						Request Encashment
					</Button>
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
	description: {
		marginBottom: 20,
	},
	card: {
		marginBottom: 24,
	},
	stepperContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	stepperButton: {
		width: 50,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
	},
	coinCount: {
		fontSize: 24,
		fontWeight: "bold",
	},
	encashDescription: {
		textAlign: "center",
	},
	encashButton: {
		marginTop: 20,
	},
})

