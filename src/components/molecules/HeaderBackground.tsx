import { Image, StyleSheet, View } from 'react-native';

interface HeaderBackgroundProps {
  height?: number;
  photoUri?: string; // foto de fundo, como no Figma (gradiente por cima de uma foto)
  children: React.ReactNode;
}

export function HeaderBackground({ height, children }: HeaderBackgroundProps) {
  return (
    <View style={[styles.container, { height }]}>
      <Image
        source={require('@/assets/images/degrade-registro.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <SvgLinearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#7FD1C3" stopOpacity={0.9} />
            <Stop offset="100%" stopColor="#4A9FD8" stopOpacity={0.9} />
          </SvgLinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#headerGradient)" />
      </Svg> */}

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
    justifyContent: 'flex-end',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
