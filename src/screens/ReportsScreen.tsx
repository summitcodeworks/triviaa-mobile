import { View, SafeAreaView, StyleSheet, TouchableOpacity, FlatList } from "react-native"
import { Text } from "../components/ui/text"
import { Card, CardContent } from "../components/ui/card"
import { BackIcon } from "../components/ui/icon"
import type { RootStackScreenProps } from "../types/navigation"

const dummyReports = [
	{ id: "1", title: "Weekly Progress", date: "2023-05-01" },
	{ id: "2", title: "Monthly Achievement", date: "2023-04-30" },
	{ id: "3", title: "Quiz Performance", date: "2023-04-15" },
]

export default function ReportsScreen({ navigation }: RootStackScreenProps<"Reports">) {
	const handleBack = () => {
		navigation.goBack()
	}

	const renderReportItem = ({ item }: { item: { id: string; title: string; date: string } }) => (
		<Card style={styles.reportCard}>
			<CardContent>
				<Text variant="subheading">{item.title}</Text>
				<Text variant="caption">{item.date}</Text>
			</CardContent>
		</Card>
	)

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity onPress={handleBack} style={styles.backButton}>
					<BackIcon size={24} color="#000" />
				</TouchableOpacity>
				<Text variant="title" style={styles.headerTitle}>
					Reports
				</Text>
			</View>
			<FlatList
				data={dummyReports}
				renderItem={renderReportItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.content}
			/>
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
	reportCard: {
		marginBottom: 16,
	},
})

