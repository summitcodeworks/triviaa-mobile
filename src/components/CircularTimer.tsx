import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type CircularTimerProps = {
    timeLeft: number;
    totalTime: number;
    size: number;
    strokeWidth: number;
};

const CircularTimer: React.FC<CircularTimerProps> = ({
                                                         timeLeft,
                                                         totalTime,
                                                         size,
                                                         strokeWidth,
                                                     }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = timeLeft / totalTime;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* Background circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E0E0E0"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={timeLeft <= 5 ? '#c62828' : '#4caf50'}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            <View style={[styles.textContainer, { width: size, height: size }]}>
                <Text style={[
                    styles.timerText,
                    timeLeft <= 5 && styles.timerWarning
                ]}>
                    {timeLeft}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        transform: [{ rotateZ: '0deg' }],
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
    },
    timerWarning: {
        color: '#c62828',
    },
});

export default CircularTimer;
