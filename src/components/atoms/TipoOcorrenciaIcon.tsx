import { theme } from '@/constants';
import type { TipoOcorrencia } from '@/types/chamado';
import { Droplets, Lightbulb, TreeDeciduous, type LucideIcon } from 'lucide-react-native';
import { Image, StyleSheet, View } from 'react-native';

const LARGURA = 82;
const ALTURA = 64;

// Só "buraco" tem arte própria (a estrada do Figma). Os demais usam um ícone
// no mesmo bloco azul-claro até o design entregar a arte de cada tipo.
const ICONES: Record<Exclude<TipoOcorrencia, 'buraco'>, LucideIcon> = {
  iluminacao_publica: Lightbulb,
  poda_arvore: TreeDeciduous,
  vazamento: Droplets,
};

interface TipoOcorrenciaIconProps {
  tipo: TipoOcorrencia;
}

export function TipoOcorrenciaIcon({ tipo }: TipoOcorrenciaIconProps) {
  if (tipo === 'buraco') {
    return (
      <Image
        source={require('../../../assets/images/logo-estrada.png')}
        style={styles.tile}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    );
  }

  const Icone = ICONES[tipo];

  return (
    <View style={[styles.tile, styles.tileIcone]}>
      <Icone size={36} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: LARGURA,
    height: ALTURA,
  },
  tileIcone: {
    backgroundColor: '#BAE6FD',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
