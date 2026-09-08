import { StyleSheet, TouchableOpacity } from 'react-native';

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode; // passe um <Ionicons /> ou similar
  backgroundColor?: string;
  size?: number;
}

export function IconButton({ onPress, children, backgroundColor = '#0E6E96', size = 40 }: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        { backgroundColor, width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
