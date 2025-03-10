import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useCoins } from '../context/CoinContext';
import { Modal, TextInput } from 'react-native';
import CircularTimer from '../components/CircularTimer.tsx';
import {UserStorageService} from "../service/user-storage.service.ts";
import {UserData} from "../models/UserData.ts";
import {globalUser, UserProvider} from "../context/UserContext.tsx";
import ApiClient, { BASE_URL } from '../utils/apiClient';

type QuizScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Quiz'>;

export default function QuizScreen({ route }: any) {
    const userStorage = new UserStorageService();
    const { categoryId } = route.params;
    const [questions, setQuestions] = useState<any[]>([]);
    const [categoryName, setCategoryName] = useState<string>('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [earnedCoins, setEarnedCoins] = useState(0);
    const [sessionId, setSessionId] = useState<number | null>(null);
    const navigation = useNavigation<QuizScreenNavigationProp>();
    const [reports, setReports] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<number | null>(null);
    const [comment, setComment] = useState<string>('');
    const [showReportModal, setShowReportModal] = useState<boolean>(false);
    const { addCoins } = useCoins();
    const [timeLeft, setTimeLeft] = useState<number>(15);
    const [timerActive, setTimerActive] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const userData = await userStorage.getUser();
            setUser(userData);
        };

        getUser();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            setTimeLeft(15);
            setTimerActive(true);
        }
    }, [currentQuestion, questions]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let isActive = true;

        if (timerActive && timeLeft > 0) {
            timer = setInterval(() => {
                if (isActive) {
                    setTimeLeft((prev) => prev - 1);
                }
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            setTimerActive(false);
            handleTimeUp();
        }

        return () => {
            isActive = false;  // Set flag to false when cleaning up
            if (timer) {clearInterval(timer);}
        };
    }, [timeLeft, timerActive]);

    useEffect(() => {
        const startQuizUrl = BASE_URL + '/api/quiz/start';
        const requestBody = {
            user_id: globalUser?.user_id,
            category_name: categoryId,
        };

        console.log('startQuizUrl:', startQuizUrl);
        console.log('Request body:', requestBody);

        fetch(startQuizUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('startQuizUrl response:', data);
                if (data.header.responseCode === 201) {
                    setSessionId(data.response.session_id); // Save session ID
                } else {
                    Alert.alert('Error', 'Failed to start quiz session');
                }
            })
            .catch((error) => {
                console.error('Error starting quiz session:', error);
                Alert.alert('Error', 'Failed to start quiz session');
            });

        const apiUrl = BASE_URL + `/api/questions/category/${categoryId}`;
        console.log('apiUrl:', apiUrl);
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log('apiUrl response:', data);
                if (data.header.responseCode === 200) {
                    setQuestions(data.response); // Set questions from API
                    setCategoryName(data.response[0]?.category_name || ''); // Set category name
                }
            })
            .catch((error) => {
                console.error('Error fetching questions:', error);
                Alert.alert('Error', 'Failed to load questions');
            });
    }, [categoryId]);

    const handleTimeUp = async () => {
        if (sessionId) {
            const answerUrl = BASE_URL + '/api/quiz/answer';
            const requestBody = {
                session_id: sessionId,
                question_id: questions[currentQuestion].id,
                selected_option: selectedAnswer || 0, // Send 0 if no answer was selected
            };

            const response = await ApiClient.post(answerUrl, requestBody);
            if (response.data.header.responseCode === 201) {
                if (currentQuestion === questions.length - 1) {
                    // If it's the last question, end the quiz
                    handleFinishQuiz();
                } else {
                    // Move to next question
                    setCurrentQuestion(currentQuestion + 1);
                }
            } else {
                Alert.alert('Error', 'Failed to save answer ' + response.data.header.responseMessage);
            }
            // fetch(answerUrl, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(requestBody),
            // })
            //     .then((response) => response.json())
            //     .then((data) => {
            //
            //     })
            //     .catch((error) => {
            //         console.error('Error saving answer:', error);
            //         Alert.alert('Error', 'Failed to save answer ' + error.message);
            //     });
        }
    };


    const handleNextQuestion = () => {
        setTimerActive(false);
        if (selectedAnswer !== null && sessionId) {
            const answerUrl = BASE_URL + '/api/quiz/answer';
            const requestBody = {
                session_id: sessionId,
                question_id: questions[currentQuestion].id,
                selected_option: selectedAnswer,
            };

            console.log('answerUrl:', answerUrl);
            console.log('Request body:', requestBody);

            fetch(answerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('answerUrl response:', data);
                    if (data.header.responseCode === 201) {
                        if (selectedAnswer === questions[currentQuestion].correct_answer) {
                            setCorrectAnswers(correctAnswers + 1);
                            const coinsForThisQuestion = 10;
                            setEarnedCoins(earnedCoins + coinsForThisQuestion);
                        }
                        console.log('Answer saved:', currentQuestion === questions.length);
                        if (currentQuestion === questions.length - 1) {
                            // If it's the last question, end the quiz
                            handleFinishQuiz();
                        } else {
                            setCurrentQuestion(currentQuestion + 1); // Move to next question
                        }
                    } else {
                        Alert.alert('Error', 'Failed to save answer');
                    }
                })
                .catch((error) => {
                    console.error('Error saving answer:', error);
                    Alert.alert('Error', 'Failed to save answer');
                });
        }
    };

    const handleFinishQuiz = () => {
        if (sessionId) {
            const endQuizUrl = BASE_URL + '/api/quiz/end';
            const requestBody = {
                session_id: sessionId,
            };

            console.log('endQuizUrl:', endQuizUrl);
            console.log('Request body:', requestBody);

            fetch(endQuizUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('endQuizUrl response:', data);
                    if (data.header.responseCode === 200) {
                        console.log('Quiz ended:', data);
                        addCoins(earnedCoins);
                        if (currentQuestion < questions.length - 1) {
                            navigation.goBack();
                        } else  {
                            navigation.replace('Result', {
                                score: data.response.score,
                                total: data.response.score,
                                coinsEarned: data.response.score,
                                sessionId: sessionId,
                            });
                        }
                    } else {
                        Alert.alert('Error', 'Failed to end quiz session');
                    }
                })
                .catch((error) => {
                    console.error('Error ending quiz session:', error);
                    Alert.alert('Error', 'Failed to end quiz session');
                });
        }
    };

    const handleBackPress = () => {
        setTimerActive(false);
        Alert.alert(
            'Exit Quiz',
            'Are you sure you want to exit? Your progress will be lost.',
            [
                {
                    text: 'Cancel',
                    onPress: () => setTimerActive(true),
                    style: 'cancel',
                },
                {
                    text: 'Exit',
                    style: 'destructive',
                    onPress: () => {
                        handleFinishQuiz();
                    },
                },
            ],
        );
    };

    const fetchReports = async () => {
        try {
            const response = await fetch(BASE_URL + '/api/reports/list');
            const data = await response.json();
            if (data.header.responseCode === 200) {
                setReports(data.response);
            } else {
                Alert.alert('Error', 'Failed to fetch report types');
            }
        } catch (error) {
            console.error('Error fetching report types:', error);
            Alert.alert('Error', 'Failed to fetch report types');
        }
    };

    const renderReportModal = () => (
        <Modal
            visible={showReportModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowReportModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Report Question</Text>
                    <ScrollView>
                        {reports.map((report) => (
                            <TouchableOpacity
                                key={report.report_id}
                                style={[
                                    styles.reportOption,
                                    selectedReport === report.report_id && styles.selectedReportOption,
                                ]}
                                onPress={() => setSelectedReport(report.report_id)}
                            >
                                <Text style={styles.reportText}>{report.report_name}</Text>
                                <Text style={styles.reportDescription}>{report.report_description}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    {selectedReport !== null && reports.find((r) => r.report_id === selectedReport)?.requires_comment && (
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Enter your comment..."
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                    )}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowReportModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSubmitReport}
                        >
                            <Text style={styles.modalButtonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const handleSubmitReport = async () => {
        if (selectedReport === null) {
            Alert.alert('Error', 'Please select a report type');
            return;
        }

        const reportData = {
            user_id: globalUser?.user_id, // Replace with actual user ID
            question_id: questions[currentQuestion].id,
            report_id: selectedReport,
            comment: comment,
        };

        try {
            const response = await fetch(BASE_URL + '/api/reports/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reportData),
            });
            const data = await response.json();
            if (data.header.responseCode === 201) {
                Alert.alert('Success', 'Report submitted successfully');
                setShowReportModal(false);
                setSelectedReport(null);
                setComment('');
            } else {
                Alert.alert('Error', 'Failed to submit report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            Alert.alert('Error', 'Failed to submit report');
        }
    };

    useEffect(() => {
        setSelectedAnswer(null);
        fetchReports();
    }, [currentQuestion]);

    if (questions.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.noQuestionsContainer}>
                    <Text style={styles.headerText}>{categoryName}</Text>
                    <Text style={styles.noQuestionsText}>No questions available for this category.</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (currentQuestion >= questions.length) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.questionCount}>Question {currentQuestion + 1}/{questions.length}</Text>
                    <View style={styles.timerContainer}>
                        <CircularTimer
                            timeLeft={timeLeft}
                            totalTime={15}
                            size={40}
                            strokeWidth={4}
                        />
                    </View>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${((currentQuestion + 1) / questions.length) * 100}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.question}>{questions[currentQuestion].question}</Text>

                <View style={styles.optionsContainer}>
                    {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                selectedAnswer === index + 1 && styles.selectedOption,
                            ]}
                            onPress={() => setSelectedAnswer(index + 1)}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedAnswer === index + 1 && styles.selectedOptionText,
                            ]}>
                                {questions[currentQuestion][optionKey]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>


            </ScrollView>
            {renderReportModal()}
            <TouchableOpacity
                style={styles.reportButton}
                onPress={() => setShowReportModal(true)}
            >
                <Text style={styles.reportButtonText}>Report Question</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        selectedAnswer === null && styles.disabledButton,
                    ]}
                    disabled={selectedAnswer === null}
                    onPress={handleNextQuestion}
                >
                    <Text style={styles.nextButtonText}>
                        {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    questionCount: {
        fontSize: 16,
        color: '#666',
        flex: 1,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    progress: {
        height: '100%',
        backgroundColor: '#1a237e',
        borderRadius: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    question: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 32,
    },
    optionsContainer: {
        gap: 16,
    },
    optionButton: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: '#f5f5f5',
    },
    selectedOption: {
        borderColor: '#1a237e',
        backgroundColor: '#1a237e',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedOptionText: {
        color: '#ffffff',
    },
    footer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    nextButton: {
        backgroundColor: '#1a237e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    nextButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noQuestionsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noQuestionsText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#1a237e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    reportOption: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 8,
    },
    selectedReportOption: {
        borderColor: '#1a237e',
        backgroundColor: '#e8eaf6',
    },
    reportText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reportDescription: {
        fontSize: 14,
        color: '#666',
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 8,
        padding: 12,
        marginTop: 16,
        minHeight: 100,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    modalButton: {
        marginLeft: 16,
        padding: 10,
    },
    modalButtonText: {
        color: '#1a237e',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reportButton: {
        padding: 16,
        backgroundColor: '#ffebee',
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginStart: 20,
        marginEnd: 20,
        marginBottom: 20,
    },
    reportButtonText: {
        color: '#c62828',
        fontSize: 16,
        fontWeight: 'bold',
    },
    timerContainer: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
