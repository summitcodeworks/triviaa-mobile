import type React from "react"
import { TextInput, StyleSheet, type TextInputProps } from "react-native"

interface InputProps extends TextInputProps {
	// Add any additional props here
}

export const Input: React.FC<InputProps> = ({ style, ...props }) => {
	return <TextInput style={[styles.input, style]} {...props} />
}

const styles = StyleSheet.create({
	input: {
		height: 40,
		borderWidth: 1,
		borderColor: "#e1e1e1",
		borderRadius: 8,
		paddingHorizontal: 12,
		fontSize: 16,
		color: "#000",
	},
})

