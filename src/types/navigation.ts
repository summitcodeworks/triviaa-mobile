import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined
    SignUp: undefined
    CreateUsername: undefined
    MainTabs: undefined;
    Category: undefined;
    Quiz: { categoryId: number };
    Result: { score: number; total: number; coinsEarned: number; sessionId: number };
    Coins: undefined;
    AddCoins: undefined
    RecentlyPlayed: undefined
    Points: undefined
    Settings: undefined
    DontWantToEarn: undefined
    ThresholdLimiter: undefined
    ChangeUsername: undefined
    ChangeProfilePicture: undefined
    EmailVerification: undefined
    Reports: undefined
    PrivacySettings: undefined
    HelpSupport: undefined
    UserDetails: { phoneNumber: string, deviceToken: string, userKey: string }
};

export type TabParamList = {
    Home: undefined;
    Leaderboard: undefined;
    Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<TabParamList, T>,
        NativeStackScreenProps<RootStackParamList>
    >;

