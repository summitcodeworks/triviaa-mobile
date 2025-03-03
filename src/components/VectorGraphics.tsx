import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

export const LoginVector = () => (
    <Svg width="200" height="200" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="7" r="4" fill="#4A90E2" />
        <Path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="#4A90E2" strokeWidth="2" />
        <Circle cx="12" cy="7" r="4" stroke="#4A90E2" strokeWidth="2" />
        <Path d="M15 11l2 2 4-4" stroke="#50E3C2" strokeWidth="2" />
    </Svg>
);

export const SignUpVector = () => (
    <Svg width="200" height="200" viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="#4A90E2" strokeWidth="2" />
        <Path d="M12 8v8M8 12h8" stroke="#50E3C2" strokeWidth="2" />
        <Circle cx="12" cy="12" r="4" fill="#4A90E2" fillOpacity="0.3" />
    </Svg>
);

export const UsernameVector = () => (
    <Svg width="200" height="200" viewBox="0 0 24 24" fill="none">
        <G stroke="#4A90E2" strokeWidth="2">
            <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <Circle cx="12" cy="7" r="4" />
        </G>
        <Path d="M12 14l2 2 4-4" stroke="#50E3C2" strokeWidth="2" />
        <Circle cx="12" cy="7" r="2" fill="#50E3C2" />
    </Svg>
);

