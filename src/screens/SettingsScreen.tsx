import {useState} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Text} from '../components/ui/text';
import {Card, CardContent} from '../components/ui/card';
import {Button} from '../components/ui/button';
import {Switch} from '../components/ui/switch';
import {ListItem} from '../components/ui/list-item';
import {
  BellIcon,
  VolumeIcon,
  MoonIcon,
  ShieldIcon,
  HelpCircleIcon,
  ShareIcon,
  LogOutIcon,
  BackIcon,
  DollarSignIcon,
  UserIcon,
  ImageIcon,
  SliderIcon,
  MailCheckIcon,
  FlagIcon,
} from '../components/ui/icon';
import type {RootStackScreenProps} from '../types/navigation';
import auth from '@react-native-firebase/auth';
import {globalUser} from "../context/UserContext.tsx";

export default function SettingsScreen({
  navigation,
}: RootStackScreenProps<'Settings'>) {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dontWantToEarn, setDontWantToEarn] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await auth().signOut();
            navigation.replace('Welcome');
          } catch (error) {
            Alert.alert(
              'Error',
              'There was a problem signing out. Please try again.',
              [{text: 'OK'}],
            );
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon size={24} color="#000" />
          </TouchableOpacity>
          <Text variant="title" style={styles.headerTitle}>
            Settings
          </Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.section}>
            <CardContent>
              <ListItem
                icon={<BellIcon />}
                title="Notifications"
                rightElement={
                  <Switch
                    value={notifications}
                    onValueChange={setNotifications}
                  />
                }
              />
              {/*<ListItem*/}
              {/*  icon={<VolumeIcon />}*/}
              {/*  title="Sound Effects"*/}
              {/*  rightElement={<Switch value={sound} onValueChange={setSound} />}*/}
              {/*/>*/}
              {/*<ListItem*/}
              {/*  icon={<MoonIcon />}*/}
              {/*  title="Dark Mode"*/}
              {/*  rightElement={*/}
              {/*    <Switch value={darkMode} onValueChange={setDarkMode} />*/}
              {/*  }*/}
              {/*/>*/}
              <ListItem
                icon={<DollarSignIcon />}
                title="Don't Want to Earn"
                rightElement={
                  <Switch
                    value={dontWantToEarn}
                    onValueChange={setDontWantToEarn}
                  />
                }
                onPress={() => navigation.navigate('DontWantToEarn')}
              />
            </CardContent>
          </Card>

          <Text variant="subheading" style={styles.sectionTitle}>
            Account & Privacy
          </Text>

          <Card style={styles.section}>
            <CardContent>
              <ListItem
                icon={<UserIcon />}
                title="Update Details"
                onPress={() => navigation.navigate('UserDetails', { phoneNumber: globalUser?.phone_number, deviceToken: globalUser?.device_token, userKey: globalUser?.user_id })}
              />
              {/* <ListItem
                icon={<ImageIcon />}
                title="Change Profile Picture"
                onPress={() => navigation.navigate('ChangeProfilePicture')}
              /> */}
              <ListItem
                icon={<SliderIcon />}
                title="Threshold Limiter"
                subtitle="Set your earning limits"
                onPress={() => navigation.navigate('ThresholdLimiter')}
              />
              <ListItem
                icon={<MailCheckIcon />}
                title="Email Verification"
                onPress={() => navigation.navigate('EmailVerification')}
              />
              <ListItem
                icon={<FlagIcon />}
                title="Reports"
                onPress={() => navigation.navigate('Reports')}
              />
              <ListItem
                icon={<ShieldIcon />}
                title="Privacy Settings"
                subtitle="Manage your data and privacy preferences"
                onPress={() => navigation.navigate('PrivacySettings')}
              />
              <ListItem
                icon={<HelpCircleIcon />}
                title="Help & Support"
                subtitle="Get help or contact us"
                onPress={() => navigation.navigate('HelpSupport')}
              />
              <ListItem
                icon={<ShareIcon />}
                title="Share App"
                subtitle="Invite friends to join"
                onPress={() => console.log('Share pressed')}
              />
            </CardContent>
          </Card>

          <View style={styles.footer}>
            <Button
              variant="outline"
              onPress={handleLogout}
              style={styles.logoutButton}>
              <View style={styles.logoutContent}>
                <LogOutIcon size={20} />
                <Text style={styles.logoutText}>Log Out</Text>
              </View>
            </Button>
            <Text variant="caption" style={styles.version}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    marginBottom: 16,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  version: {
    color: '#999',
  },
});
