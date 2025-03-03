import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { theme } from '../constants/theme';
import type { RootStackScreenProps } from '../types/navigation';
import { UsernameVector } from '../components/VectorGraphics';
import { Background } from '../components/Background';

export default function CreateUsernameScreen({ navigation }: RootStackScreenProps<'CreateUsername'>) {
    const [username, setUsername] = useState('');

    const handleCreateUsername = async () => {
        if (username.length >= 3) {
            setTimeout(() => {
                navigation.replace('MainTabs');
            }, 1000);
        } else {
            Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Background />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <View style={styles.vectorContainer}>
                    <UsernameVector />
                </View>
                <Text style={styles.title}>Create Username</Text>
                <Text style={styles.subtitle}>Choose a unique username</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor="#A0A0A0"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleCreateUsername}>
                    <Text style={styles.buttonText}>Create Username</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    vectorContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666666',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

