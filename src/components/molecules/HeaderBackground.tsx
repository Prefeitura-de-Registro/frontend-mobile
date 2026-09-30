import { Image, StyleSheet, View } from 'react-native';

interface HeaderBackgroundProps {
  height?: number;
  photoUri?: string;
  /** Se informado, usa cor sólida no lugar da imagem de degradê. */
  backgroundColor?: string;
  children: React.ReactNode;
}

export function HeaderBackground({ height = 130, backgroundColor, children }: HeaderBackgroundProps) {
  return (
    <View style={[styles.container, { height }, backgroundColor ? { backgroundColor } : null]}>
      {!backgroundColor && (
        <Image
          source={require('@/assets/images/degrade-registro.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}
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
