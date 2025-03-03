import type React from 'react';
import { Switch as RNSwitch, StyleSheet } from 'react-native';

interface SwitchProps {
	value: boolean
	onValueChange: (value: boolean) => void
}

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange }) => {
	return (
		<RNSwitch
			value={value}
			onValueChange={onValueChange}
			trackColor={{ false: '#e1e1e1', true: '#000' }}
			thumbColor={'#fff'}
			ios_backgroundColor="#e1e1e1"
			style={styles.switch}
		/>
	);
};

const styles = StyleSheet.create({
	switch: {
		transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
	},
});

