import { View } from "react-native"
import Svg, { Path, Circle } from "react-native-svg"

interface IconProps {
	size?: number
	color?: string
	strokeWidth?: number
}

export const BellIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
			<Path d="M13.73 21a2 2 0 0 1-3.46 0" />
		</Svg>
	</View>
)

export const VolumeIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M11 5 6 9H2v6h4l5 4V5z" />
			<Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
		</Svg>
	</View>
)

export const MoonIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</Svg>
	</View>
)

export const ShieldIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</Svg>
	</View>
)

export const HelpCircleIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
			<Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
			<Path d="M12 17h.01" />
		</Svg>
	</View>
)

export const ShareIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
			<Path d="m16 6-4-4-4 4" />
			<Path d="M12 2v13" />
		</Svg>
	</View>
)

export const LogOutIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<Path d="m16 17 5-5-5-5" />
			<Path d="M21 12H9" />
		</Svg>
	</View>
)

export const ChevronRightIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="m9 18 6-6-6-6" />
		</Svg>
	</View>
)

export const BackIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M19 12H5" />
			<Path d="M12 19l-7-7 7-7" />
		</Svg>
	</View>
)

export const DollarSignIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
		</Svg>
	</View>
)

export const UserIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<Circle cx="12" cy="7" r="4" />
		</Svg>
	</View>
)

export const ImageIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M21 3H3C1.89543 3 1 3.89543 1 5V19C1 20.1046 1.89543 21 3 21H21C22.1046 21 23 20.1046 23 19V5C23 3.89543 22.1046 3 21 3Z" />
			<Path d="M9 11L12 14L15 11" />
			<Path d="M6 19L9 16L11 18L15 14L19 19" />
		</Svg>
	</View>
)

export const SliderIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M4 21V14" />
			<Path d="M4 10V3" />
			<Path d="M12 21V12" />
			<Path d="M12 8V3" />
			<Path d="M20 21V16" />
			<Path d="M20 12V3" />
			<Path d="M1 14H7" />
			<Path d="M9 8H15" />
			<Path d="M17 16H23" />
		</Svg>
	</View>
)

export const MailCheckIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M22 13V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H13" />
			<Path d="M22 7L13.03 12.7C12.7213 12.8934 12.3643 12.996 12 12.996C11.6357 12.996 11.2787 12.8934 10.97 12.7L2 7" />
			<Path d="M16 19L18 21L22 17" />
		</Svg>
	</View>
)

export const FlagIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V3C20 3 19 4 16 4C13 4 11 2 8 2C5 2 4 3 4 3V15Z" />
			<Path d="M4 22V15" />
		</Svg>
	</View>
)

export const PhoneIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
		</Svg>
	</View>
)

export const MailIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
			<Path d="m22 6-10 7L2 6" />
		</Svg>
	</View>
)

export const ChatIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</Svg>
	</View>
)

export const CameraIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
			<Circle cx="12" cy="13" r="4" />
		</Svg>
	</View>
)

export const CoinsIcon = ({ size = 24, color = "#000", strokeWidth = 2 }: IconProps) => (
	<View style={{ width: size, height: size }}>
		<Svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<Path d="M12 6c0 1.657-2.686 3-6 3S0 7.657 0 6s2.686-3 6-3 6 1.343 6 3z" />
			<Path d="M12 12c0 1.657-2.686 3-6 3s-6-1.343-6-3" />
			<Path d="M12 18c0 1.657-2.686 3-6 3s-6-1.343-6-3" />
			<Path d="M24 6c0 1.657-2.686 3-6 3s-6-1.343-6-3" />
			<Path d="M24 12c0 1.657-2.686 3-6 3s-6-1.343-6-3" />
			<Path d="M24 18c0 1.657-2.686 3-6 3s-6-1.343-6-3" />
			<Path d="M0 6v12" />
			<Path d="M12 6v12" />
			<Path d="M24 6v12" />
		</Svg>
	</View>
)

export {
	BellIcon,
	VolumeIcon,
	MoonIcon,
	ShieldIcon,
	HelpCircleIcon,
	ShareIcon,
	LogOutIcon,
	BackIcon,
	ChevronRightIcon,
	DollarSignIcon,
	UserIcon,
	ImageIcon,
	SliderIcon,
	MailCheckIcon,
	FlagIcon,
	PhoneIcon,
	MailIcon,
	ChatIcon,
	CameraIcon,
	CoinsIcon
}

