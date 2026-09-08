import { Avatar } from '@/components/atoms/Avatar';
import { CheckboxItem } from '@/components/atoms/CheckboxItem';
import { Divider } from '@/components/atoms/Divider';
import { FilterChip } from '@/components/atoms/FilterChip';
import { IconButton } from '@/components/atoms/IconButton';
import { LinkText } from '@/components/atoms/LinkText';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { PriorityBadge } from '@/components/atoms/PriorityBadge';
import { SearchInput } from '@/components/atoms/SearchInput';
import { SecondaryButton } from '@/components/atoms/SecondaryButton';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { theme } from '@/constants';
import { PrioridadeChamado, StatusChamado } from '@/types/chamado';
import { Bell } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const ALL_STATUS: StatusChamado[] = ['aberto', 'em_atendimento', 'concluido'];
const ALL_PRIORITY: PrioridadeChamado[] = ['urgente', 'medio', 'normal'];

export default function ComponentsShowcaseScreen() {
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState(false);
  const [selectedChip, setSelectedChip] = useState<PrioridadeChamado | null>('urgente');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Vitrine de componentes</Text>

      <Section title="StatusBadge">
        <Row>
          {ALL_STATUS.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </Row>
      </Section>

      <Section title="PriorityBadge">
        <Row>
          {ALL_PRIORITY.map((p) => (
            <PriorityBadge key={p} prioridade={p} />
          ))}
        </Row>
      </Section>

      <Section title="Botões">
        <PrimaryButton label="Atender chamado" onPress={() => {}} />
        <View style={{ height: 12 }} />
        <PrimaryButton label="Carregando" onPress={() => {}} loading />
        <View style={{ height: 12 }} />
        <PrimaryButton label="Desabilitado" onPress={() => {}} disabled />
        <View style={{ height: 12 }} />
        <SecondaryButton label="Transferir para outro setor" onPress={() => {}} />
      </Section>

      <Section title="IconButton + Avatar">
        <Row>
          <IconButton onPress={() => {}}>
            <Bell size={20} color="white" />
          </IconButton>
          <Avatar uri="https://i.pravatar.cc/100" size={48} />
        </Row>
      </Section>

      <Section title="SearchInput">
        <SearchInput value={search} onChangeText={setSearch} />
      </Section>

      <Section title="FilterChip">
        <Row>
          {ALL_PRIORITY.map((p) => (
            <FilterChip
              key={p}
              label={p}
              color={p === 'urgente' ? '#E53935' : p === 'medio' ? '#F5A623' : '#7B61FF'}
              selected={selectedChip === p}
              onToggle={() => setSelectedChip(p === selectedChip ? null : p)}
            />
          ))}
        </Row>
      </Section>

      <Section title="CheckboxItem">
        <CheckboxItem label="Buraco" checked={checked} onToggle={() => setChecked(!checked)} />
      </Section>

      <Section title="LinkText">
        <LinkText label="Ver mapa completo" onPress={() => {}} />
      </Section>

      <Section title="Divider">
        <Divider />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  pageTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    marginBottom: 8,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
});
