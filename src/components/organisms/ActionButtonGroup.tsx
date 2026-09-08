import { StatusChamado } from '@/types/chamado';
import { View } from 'react-native';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { SecondaryButton } from '../atoms/SecondaryButton';

interface ActionButtonGroupProps {
  status: StatusChamado;
  onTransferir?: () => void;
  onAtender?: () => void;
  onFinalizar?: () => void;
}

export function ActionButtonGroup({
  status,
  onTransferir,
  onAtender,
  onFinalizar,
}: ActionButtonGroupProps) {
  if (status === 'aberto') {
    return (
      <View style={{ gap: 12 }}>
        <SecondaryButton label="Transferir para outro setor" onPress={onTransferir ?? (() => {})} />
        <PrimaryButton label="Atender chamado" onPress={onAtender ?? (() => {})} />
      </View>
    );
  }

  if (status === 'em_atendimento') {
    return <PrimaryButton label="Finalizar atendimento" onPress={onFinalizar ?? (() => {})} />;
  }

  // concluído: sem ações
  return null;
}
