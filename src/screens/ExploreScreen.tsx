import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import type { TabScreenProps } from '../types/navigation';

const trendingQuizzes = [
    { id: 1, title: 'Movie Trivia', questions: 15, players: 1234 },
    { id: 2, title: 'Sports Legends', questions: 20, players: 856 },
    { id: 3, title: 'Tech Giants', questions: 10, players: 2341 },
];

export default function ExploreScreen({ navigation }: TabScreenProps<'Explore'>) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Explore Quizzes</Text>

                <Text style={styles.sectionTitle}>Trending Now</Text>
                {trendingQuizzes.map((quiz) => (
                    <TouchableOpacity
                        key={quiz.id}
                        style={styles.quizCard}
                        onPress={() => navigation.navigate('Quiz')}
                    >
                        <Text style={styles.quizTitle}>{quiz.title}</Text>
                        <View style={styles.quizInfo}>
                            <Text style={styles.quizInfoText}>{quiz.questions} Questions</Text>
                            <Text style={styles.quizInfoText}>{quiz.players} Players</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    quizCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quizTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    quizInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quizInfoText: {
        color: '#666',
        fontSize: 14,
    },
});

