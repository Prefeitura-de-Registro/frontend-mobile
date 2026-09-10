import { Image, StyleSheet, View } from 'react-native';

export function FooterLogo() {
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/brasao-registro.png')} resizeMode="contain" />
      <Image source={require('@/assets/images/fatec-registro.png')} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    width: '100%',
    backgroundColor: 'transparent',
  },
  logo: {
    height: 32,
  },
});
