import { theme } from '@/constants';
import { Bell } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';

interface HeaderGreetingContentProps {
  userName: string;
  role: string;
  avatarUri: string;
  onPressNotification: () => void;
}

export function HeaderGreetingContent({
  userName,
  role,
  avatarUri,
  onPressNotification,
}: HeaderGreetingContentProps) {
  return (
    <View style={styles.row}>
      <Avatar uri={avatarUri} size={48} />
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>Olá, {userName}!</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
      <IconButton onPress={onPressNotification} backgroundColor={theme.colors.primary}>
        <Bell size={18} color="white" />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    fontFamily: theme.fonts.bold,
    fontSize: 18,
    color: theme.colors.primary,
  },
  role: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    color: '#333',
  },
});
