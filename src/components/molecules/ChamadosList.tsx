import { theme } from '@/constants';
import { Chamado } from '@/types/chamado';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ChamadoListItem } from './ChamadoListItem';

interface ChamadosListProps {
  chamados: Chamado[];
  onSelectChamado: (id: string) => void;
  emptyLabel?: string;
}

export function ChamadosList({
  chamados,
  onSelectChamado,
  emptyLabel = 'Nenhum chamado encontrado.',
}: ChamadosListProps) {
  return (
    <FlatList
      data={chamados}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChamadoListItem chamado={item} onPress={onSelectChamado} />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListEmptyComponent={<Text style={styles.empty}>{emptyLabel}</Text>}
      showsVerticalScrollIndicator={false}
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
