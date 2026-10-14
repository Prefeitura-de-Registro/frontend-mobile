import { theme } from '@/constants';
import * as Clipboard from 'expo-clipboard';
import { Check, Copy } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DURACAO_FEEDBACK_MS = 2000;

interface ProtocoloCopiavelProps {
  protocolo: string;
}

export function ProtocoloCopiavel({ protocolo }: ProtocoloCopiavelProps) {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copiar() {
    try {
      await Clipboard.setStringAsync(protocolo);
    } catch (error) {
      console.error('[protocolo] erro ao copiar', error);
      Alert.alert('Não foi possível copiar', 'Tente novamente.');
      return;
    }

    setCopiado(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiado(false), DURACAO_FEEDBACK_MS);
  }

  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Text style={styles.protocolo} selectable>
          {protocolo}
        </Text>
      </View>

      <TouchableOpacity
        onPress={copiar}
        style={styles.copyButton}
        activeOpacity={0.8}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={copiado ? 'Protocolo copiado' : 'Copiar protocolo'}
      >
        {copiado ? (
          <Check size={14} color="white" strokeWidth={3} />
        ) : (
          <Copy size={14} color="white" />
        )}
      </TouchableOpacity>

      {copiado && (
        <Text style={styles.feedback} accessibilityLiveRegion="polite">
          Copiado!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: theme.colors.tertiary,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  protocolo: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#333333',
  },
  copyButton: {
    width: 24,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  feedback: {
    marginLeft: 8,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    color: theme.colors.primary,
  },
});
