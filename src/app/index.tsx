import { FooterLogo } from '@/components/organisms/FooterLogo';
import { theme } from '@/constants';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function DevIndexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área de testes</Text>

      <Link href="/dev/components-showcase" style={styles.link}>
        Átomos (components-showcase)
      </Link>
      <Link href="/dev/organisms-showcase" style={styles.link}>
        Moléculas + Organismos (organisms-showcase)
      </Link>
      <Link href="/chamado" style={styles.link}>
        Chamados 
      </Link>

      <Link href="/home" style={styles.link}>
        Voltar para Home
      </Link>

      <FooterLogo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    gap: 20,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
  },
  link: {
    fontFamily: theme.fonts.medium,
    fontSize: 16,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
