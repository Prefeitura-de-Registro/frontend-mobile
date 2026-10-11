import type { Coordenadas } from '@/types/chamado';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const COR_PIN = '#0B5878';

interface MapaOcorrenciaProps {
  coordenadas: Coordenadas;
  height?: number;
}

// Mapa só de visualização: os gestos ficam desligados para não brigar com a
// rolagem da tela de detalhes.
export function MapaOcorrencia({ coordenadas, height = 235 }: MapaOcorrenciaProps) {
  const { latitude, longitude } = coordenadas;

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        key={`${latitude},${longitude}`}
        style={StyleSheet.absoluteFill}
        initialRegion={{ latitude, longitude, latitudeDelta: 0.006, longitudeDelta: 0.006 }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
      >
        <Marker coordinate={{ latitude, longitude }} anchor={{ x: 0.5, y: 1 }}>
          <Ionicons name="location-sharp" size={44} color={COR_PIN} />
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#E8EEF4',
  },
});
