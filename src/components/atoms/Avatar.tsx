import { Image, StyleSheet } from 'react-native';

interface AvatarProps {
  uri: string;
  size?: number;
}

export function Avatar({ uri, size = 48 }: AvatarProps) {
  return (
    <Image
      source={{ uri }}
      style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#eee',
  },
});
