import { theme } from '@/constants';
import { Chamado } from '@/types/chamado';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinkText } from '../atoms/LinkText';
import { StatusBadge } from '../atoms/StatusBadge';
import { ActionButtonGroup } from '../organisms/ActionButtonGroup';
import { InfoRow } from '../organisms/InfoRow';

interface CardChamadoDetalheProps {
  chamado: Chamado;
  onTransferir?: () => void;
  onAtender?: () => void;
  onFinalizar?: () => void;
  onAbrirFoto?: (foto: string) => void;
}

export function CardChamadoDetalhe({
  chamado,
  onTransferir,
  onAtender,
  onFinalizar,
  onAbrirFoto,
}: CardChamadoDetalheProps) {
  const [expanded, setExpanded] = useState(false);
  const emAtendimento = chamado.status === 'em_atendimento';

  return (
    <View style={[styles.card, emAtendimento && styles.cardEmAtendimento]}>
      <Text style={[styles.title, emAtendimento && styles.titlePrimary]}>{chamado.titulo}</Text>
      <Text style={styles.code}>#{chamado.id}</Text>

      <View style={styles.divider} />

      <View style={styles.infoBlock}>
        <InfoRow label="Criado em:" value={chamado.criadoEm} />
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status:</Text>
          <StatusBadge status={chamado.status} />
        </View>

        <View style={styles.descricaoBlock}>
          <Text style={styles.descricaoLabel}>Descrição:</Text>
          <Text style={styles.descricaoValue}>{chamado.descricao}</Text>
        </View>

        {chamado.fotos && chamado.fotos.length > 0 && (
          <View style={styles.fotosRow}>
            <Text style={styles.descricaoLabel}>Fotos:</Text>
            {chamado.fotos.map((foto, index) => (
              <View key={foto} style={styles.fotoLinkWrapper}>
                <LinkText label={foto} onPress={() => onAbrirFoto?.(foto)} />
                {index < chamado.fotos!.length - 1 && <Text style={styles.comma}>,</Text>}
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.maisDetalhesRow}
          activeOpacity={0.7}
        >
          <Text style={styles.maisDetalhesLabel}>Mais detalhes</Text>
          {expanded ? (
            <ChevronUp size={16} color="#555" />
          ) : (
            <ChevronDown size={16} color="#555" />
          )}
        </TouchableOpacity>

        {expanded && (
          <View style={styles.extraDetails}>
            <InfoRow label="Endereço:" value={chamado.endereco} />
            <InfoRow label="Prioridade:" value={chamado.prioridade} />
            <InfoRow label="SLA:" value={chamado.slaLabel} />
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <ActionButtonGroup
          status={chamado.status}
          onTransferir={onTransferir}
          onAtender={onAtender}
          onFinalizar={onFinalizar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    // sombra leve
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardEmAtendimento: {
    backgroundColor: '#EEF5FA',
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 20,
    color: '#222',
  },
  titlePrimary: {
    color: theme.colors.primary,
  },
  code: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#777',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EEE',
    marginBottom: 16,
  },
  infoBlock: {
    width: '100%',
    gap: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: '#333',
  },
  descricaoBlock: {
    gap: 4,
  },
  descricaoLabel: {
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    color: '#333',
  },
  descricaoValue: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#666',
    textAlign: 'justify',
  },
  fotosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  fotoLinkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comma: {
    marginLeft: 2,
    color: '#666',
  },
  maisDetalhesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  maisDetalhesLabel: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#555',
  },
  extraDetails: {
    gap: 10,
    paddingTop: 4,
  },
  actions: {
    width: '100%',
    marginTop: 24,
  },
});
