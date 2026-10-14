import { theme } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LogOut,
  User,
} from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MenuOperadorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { usuario, signOut } = useAuth();

  const nomeExibicao = usuario?.nome || 'Operador';

  // TODO(integração): trocar pelo departamento real do usuário quando o back devolver
  const secretariaExibicao = 'Secretaria de Obras';

  const iniciais = nomeExibicao
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  async function handleSair() {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarInitials}>{iniciais}</Text>
        </View>
        <Text style={styles.userName}>{nomeExibicao}</Text>
        <Text style={styles.userRole}>{secretariaExibicao}</Text>
      </View>

      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
          <View style={styles.menuItemLeft}>
            <User color="#666666" size={20} />
            <Text style={styles.menuItemText}>Meu perfil</Text>
          </View>
          <ChevronRight color="#666666" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push('./solicitacoes')}
        >
          <View style={styles.menuItemLeft}>
            <ClipboardList color="#666666" size={20} />
            <Text style={styles.menuItemText}>Minhas solicitações</Text>
          </View>
          <ChevronRight color="#666666" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => router.push('./notificacoes')}
        >
          <View style={styles.menuItemLeft}>
            <Bell color="#666666" size={20} />
            <Text style={styles.menuItemText}>Notificações</Text>
          </View>
          <ChevronRight color="#666666" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutItem]}
          activeOpacity={0.7}
          onPress={handleSair}
        >
          <View style={styles.menuItemLeft}>
            <LogOut color="#E02424" size={20} />
            <Text style={styles.logoutText}>Sair</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0072AE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0072AE',
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarInitials: {
    fontFamily: theme.fonts.bold,
    fontSize: 36,
    color: '#0072AE',
  },
  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: '#0072AE',
    marginBottom: 4,
  },
  userRole: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: '#333333',
  },
  menuList: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#666666',
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  logoutText: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: '#E02424',
  },
});