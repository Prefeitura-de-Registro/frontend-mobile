import { StyleSheet, View } from 'react-native';

export function Divider() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: '#E5E5E5',
    width: '100%',
  },
});
