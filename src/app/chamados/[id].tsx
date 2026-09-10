import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetalhesChamado() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Tela &quot;Detalhes do chamado&quot; em construção
      </Text>
      <Text style={{ fontSize: 16, color: '#475569' }}>ID recebido: {id}</Text>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          borderWidth: 2,
          borderColor: '#0073A9',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: '#0073A9', fontWeight: 'bold' }}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}
