import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle } from 'react-native-svg';

export const Background = () => (
    <View style={StyleSheet.absoluteFillObject}>
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFillObject}>
            <Defs>
                <Pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <Circle cx="20" cy="20" r="1" fill="#E0E0E0" />
                </Pattern>
            </Defs>
            <Rect width="100%" height="100%" fill="#FAF9F6" />
            <Rect width="100%" height="100%" fill="url(#pattern)" />
        </Svg>
    </View>
);

