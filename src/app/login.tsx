import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tela &quot;Login&quot; em construção</Text>

      <TouchableOpacity
        onPress={() => router.push('/')}
        style={{
          backgroundColor: '#0073A9',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Entrar (placeholder)</Text>
      </TouchableOpacity>
    </View>
  );
}
