import { Image, StyleSheet, View } from 'react-native';

interface HeaderBackgroundProps {
  height?: number;
  photoUri?: string;
  children: React.ReactNode;
}

export function HeaderBackground({ height = 130, children }: HeaderBackgroundProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Image source={require('@/assets/images/degrade-registro.png')} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // Garante que começa alinhado à esquerda da tela
    paddingHorizontal: 20,
  },
});