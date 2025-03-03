import { View, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { BackIcon, PhoneIcon, MailIcon, ChatIcon } from "../components/ui/icon"
import type { RootStackScreenProps } from "../types/navigation"

export default function HelpSupportScreen({ navigation }: RootStackScreenProps<"HelpSupport">) {
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
					Help & Support
				</Text>
			</View>
			<ScrollView style={styles.content}>
				<Card style={styles.card}>
					<CardContent>
						<Text variant="subheading" style={styles.sectionTitle}>
							Contact Us
						</Text>
						<Button variant="outline" style={styles.button}>
							<PhoneIcon size={20} />
							<Text style={styles.buttonText}>Call Support</Text>
						</Button>
						<Button variant="outline" style={styles.button}>
							<MailIcon size={20} />
							<Text style={styles.buttonText}>Email Support</Text>
						</Button>
						<Button variant="outline" style={styles.button}>
							<ChatIcon size={20} />
							<Text style={styles.buttonText}>Live Chat</Text>
						</Button>
					</CardContent>
				</Card>
				<Card style={styles.card}>
					<CardContent>
						<Text variant="subheading" style={styles.sectionTitle}>
							FAQs
						</Text>
						<TouchableOpacity style={styles.faqItem}>
							<Text variant="body">How do I reset my password?</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.faqItem}>
							<Text variant="body">How can I report a bug?</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.faqItem}>
							<Text variant="body">Where can I find my quiz history?</Text>
						</TouchableOpacity>
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
	sectionTitle: {
		marginBottom: 16,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	buttonText: {
		marginLeft: 8,
	},
	faqItem: {
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#e1e1e1",
	},
})

