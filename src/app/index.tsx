import { View, Text, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'

export default function Index() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Tela &quot;Listagem de chamados&quot; em construção</Text>

      <TouchableOpacity
        onPress={() => router.push('/chamados/123')}
        style={{ backgroundColor: '#0073A9', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ver chamado de exemplo</Text>
      </TouchableOpacity>
    </View>
  )
}
