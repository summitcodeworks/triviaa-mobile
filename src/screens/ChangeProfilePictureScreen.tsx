import { View, SafeAreaView, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { BackIcon, CameraIcon } from "../components/ui/icon"
import type { RootStackScreenProps } from "../types/navigation"

export default function ChangeProfilePictureScreen({ navigation }: RootStackScreenProps<"ChangeProfilePicture">) {
	const handleBack = () => {
		navigation.goBack()
	}

	const handleChangePhoto = () => {
		// TODO: Implement photo change logic
		console.log("Changing profile picture")
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack} style={styles.backButton}>
					<BackIcon size={24} color="#000" />
				</TouchableOpacity>
				<Text variant="title" style={styles.headerTitle}>
					Change Profile Picture
				</Text>
			</View>
			<View style={styles.content}>
				<Card style={styles.card}>
					<CardContent>
						<View style={styles.imageContainer}>
							<Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
							<TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
								<CameraIcon size={24} color="#fff" />
							</TouchableOpacity>
						</View>
						<Button onPress={handleChangePhoto} style={styles.button}>
							Choose New Picture
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
	imageContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	profileImage: {
		width: 150,
		height: 150,
		borderRadius: 75,
	},
	cameraButton: {
		position: "absolute",
		right: 0,
		bottom: 0,
		backgroundColor: "#000",
		borderRadius: 20,
		padding: 8,
	},
	button: {
		width: "100%",
	},
})

