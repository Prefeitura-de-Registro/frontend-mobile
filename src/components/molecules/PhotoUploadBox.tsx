import { theme } from '@/constants';
import { CheckCircle2, Upload } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface PhotoUploadBoxProps {
  hasPhoto: boolean;
  onPress: () => void;
}

export function PhotoUploadBox({ hasPhoto, onPress }: PhotoUploadBoxProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {hasPhoto ? (
        <CheckCircle2 size={26} color={theme.colors.primary} />
      ) : (
        <Upload size={26} color={theme.colors.primary} />
      )}
      <Text style={styles.title}>{hasPhoto ? 'Foto adicionada' : 'Upload'}</Text>
      <Text style={styles.subtitle}>
        {hasPhoto ? 'Toque para trocar a foto' : 'Toque para adicionar uma foto'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: 16,
    width: 215,
    alignSelf: 'center',
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F2F2F2',
    
  },
  title: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#888',
  },
});