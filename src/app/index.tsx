import { theme } from '@/constants'
import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'

export default function Index() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 20, fontFamily: theme.fonts.bold }}>Tela &quot;Listagem de chamados&quot; em construção</Text>

      <TouchableOpacity
        onPress={() => router.push('/chamados/123')}
        style={{ backgroundColor: theme.colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}
      >
        <Text style={{ color: 'white', fontFamily: theme.fonts.bold }}>Ver chamado de exemplo</Text>
      </TouchableOpacity>
    </View>
  )
}
