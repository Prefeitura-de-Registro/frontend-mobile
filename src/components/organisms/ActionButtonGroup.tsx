import { StatusChamado } from '@/types/chamado';
import { View } from 'react-native';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { SecondaryButton } from '../atoms/SecondaryButton';

interface ActionButtonGroupProps {
  status: StatusChamado;
  onTransferir?: () => void;
  onAtender?: () => void;
  onFinalizar?: () => void;
  /** Texto do botão secundário (padrão: "Transferir para outro setor"). */
  labelTransferir?: string;
  /** Mostra o carregamento no botão "Atender chamado". */
  atendendo?: boolean;
}

export function ActionButtonGroup({
  status,
  onTransferir,
  onAtender,
  onFinalizar,
  labelTransferir = 'Transferir para outro setor',
  atendendo,
}: ActionButtonGroupProps) {
  if (status === 'aberto') {
    return (
      <View style={{ gap: 12 }}>
        <SecondaryButton label={labelTransferir} onPress={onTransferir ?? (() => { })} />
        <PrimaryButton
          label="Atender chamado"
          onPress={onAtender ?? (() => { })}
          loading={atendendo}
        />
      </View>
    );
  }

  if (status === 'em_atendimento') {
    return <PrimaryButton label="Finalizar atendimento" onPress={onFinalizar ?? (() => { })} />;
  }

  // concluído: sem ações
  return null;
}
