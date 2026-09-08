import { theme } from '@/constants';
import { Chamado } from '@/types/chamado';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ChamadoListItem } from '../molecules/ChamadoListItem';

interface ChamadosListProps {
  chamados: Chamado[];
  onSelectChamado: (id: string) => void;
  emptyLabel?: string;
  scrollEnabled?: boolean; // false quando usado dentro de outro ScrollView (ex: telas de teste)
}

export function ChamadosList({
  chamados,
  onSelectChamado,
  emptyLabel = 'Nenhum chamado encontrado.',
  scrollEnabled = true,
}: ChamadosListProps) {
  return (
    <FlatList
      data={chamados}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChamadoListItem chamado={item} onPress={onSelectChamado} />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListEmptyComponent={<Text style={styles.empty}>{emptyLabel}</Text>}
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 24,
  },
});
