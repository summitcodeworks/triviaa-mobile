import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, LinearGradient, Stop, Ellipse } from 'react-native-svg';

export const LoginVector = () => (
    <Svg width="280" height="220" viewBox="0 0 280 220" fill="none">
    <Defs>
      <LinearGradient id="bgGradient" x1="0" y1="0" x2="280" y2="220" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#6C63FF" />
        <Stop offset="1" stopColor="#FF6584" />
      </LinearGradient>
      
      <LinearGradient id="shapeGradient" x1="140" y1="30" x2="140" y2="190" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#FF9190" />
        <Stop offset="1" stopColor="#FF6584" />
      </LinearGradient>
      
      <LinearGradient id="personGradient" x1="140" y1="60" x2="140" y2="160" gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#6C63FF" />
        <Stop offset="1" stopColor="#5A56E9" />
      </LinearGradient>
    </Defs>
    
    {/* Abstract background shapes */}
    <Circle cx="50" cy="50" r="40" fill="#6C63FF" opacity="0.1" />
    <Circle cx="230" cy="170" r="40" fill="#FF6584" opacity="0.1" />
    <Ellipse cx="140" cy="200" rx="100" ry="15" fill="#6C63FF" opacity="0.2" />
    
    {/* Floating elements */}
    <Circle cx="40" cy="100" r="8" fill="#FFD166" />
    <Circle cx="240" cy="80" r="6" fill="#FFD166" />
    <Circle cx="200" cy="40" r="5" fill="#FF6584" />
    <Circle cx="80" cy="170" r="7" fill="#6C63FF" />
    
    {/* Main illustration - Person with floating device */}
    <G transform="translate(90, 60)">
      {/* Device */}
      <Rect x="0" y="0" width="100" height="70" rx="10" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="2" />
      <Rect x="10" y="10" width="80" height="40" rx="4" fill="#F5F5F5" />
      
      {/* Lock icon on screen */}
      <G transform="translate(40, 20)">
        <Circle cx="10" cy="10" r="10" fill="#6C63FF" opacity="0.2" />
        <Rect x="7" y="10" width="6" height="8" rx="1" fill="#6C63FF" />
        <Path d="M5 10 C5 7 7 5 10 5 C13 5 15 7 15 10" stroke="#6C63FF" strokeWidth="1.5" fill="none" />
      </G>
      
      {/* Device buttons */}
      <Circle cx="50" cy="60" r="4" fill="#E0E0E0" />
    </G>
    
    {/* Person character */}
    <G transform="translate(110, 120)">
      {/* Body */}
      <Path d="M30 0 C45 0 60 15 60 40 L0 40 C0 15 15 0 30 0Z" fill="url(#personGradient)" />
      
      {/* Head */}
      <Circle cx="30" cy="-15" r="20" fill="#6C63FF" />
      
      {/* Face */}
      <Circle cx="23" cy="-18" r="2" fill="#FFFFFF" />
      <Circle cx="37" cy="-18" r="2" fill="#FFFFFF" />
      <Path d="M25 -10 C28 -8 32 -8 35 -10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </G>
    
    {/* Floating authentication elements */}
    <G transform="translate(60, 90)">
      <Circle cx="0" cy="0" r="10" fill="#FFFFFF" />
      <Path d="M-4 0 L-1 3 L4 -3" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </G>
    
    <G transform="translate(200, 100)">
      <Circle cx="0" cy="0" r="12" fill="#FFFFFF" />
      <Path d="M-3 0 C-3 -3 0 -6 3 -3 C6 0 3 6 -3 3 C-6 0 -3 -3 -3 0Z" fill="#FF6584" />
    </G>
    
    {/* Decorative lines */}
    <Path d="M40 120 C60 100 80 130 100 110" stroke="#FFD166" strokeWidth="2" strokeDasharray="2 2" />
    <Path d="M180 80 C200 100 220 70 240 90" stroke="#FFD166" strokeWidth="2" strokeDasharray="2 2" />
    
    {/* Sparkles */}
    <Path d="M60 60 L65 65 M60 65 L65 60" stroke="#FFD166" strokeWidth="1.5" />
    <Path d="M210 150 L215 155 M210 155 L215 150" stroke="#FFD166" strokeWidth="1.5" />
    <Path d="M170 40 L175 45 M170 45 L175 40" stroke="#FF6584" strokeWidth="1.5" />
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

