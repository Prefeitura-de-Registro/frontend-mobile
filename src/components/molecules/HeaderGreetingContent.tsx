import { theme } from '@/constants';
import { Bell } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';

interface HeaderGreetingContentProps {
  userName: string;
  role: string;
  avatarUri: string;
  onPressNotification: () => void;
  onPressProfile?: () => void; // 1. Ensinamos o componente a aceitar esta nova propriedade
  /** Mostra o ponto vermelho no sino quando há notificações novas. */
  hasNotification?: boolean;
}

export function HeaderGreetingContent({
  userName,
  role,
  avatarUri,
  onPressNotification,
  onPressProfile, // 2. Recebemos a propriedade aqui
  hasNotification = false,
}: HeaderGreetingContentProps) {
  return (
    <View style={styles.row}>
      
      {/* 3. Transformámos a View do Avatar num botão clicável */}
      <TouchableOpacity activeOpacity={0.8} onPress={onPressProfile}>
        <View style={styles.avatarRing}>
          <Avatar uri={avatarUri} size={48} />
        </View>
      </TouchableOpacity>

      <View style={styles.textBlock}>
        <Text style={styles.greeting}>Olá, {userName}!</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
      
      <View>
        <IconButton onPress={onPressNotification} backgroundColor={theme.colors.primary}>
          <Bell size={20} color="white" />
        </IconButton>
        {hasNotification ? <View style={styles.dot} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarRing: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 999,
    padding: 2,
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: theme.colors.primary,
  },
  role: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: '#111',
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E02424',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});