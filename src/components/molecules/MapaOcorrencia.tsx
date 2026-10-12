
import type { Coordenadas } from '@/types/chamado';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapaOcorrenciaProps {
  coordenadas: Coordenadas;
}

function criarHtmlMapa(latitude: number, longitude: number): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
  />

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  />

  <style>
    * {
      box-sizing: border-box;
    }

    html,
    body,
    #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #e8edf0;
    }

    .leaflet-control-attribution {
      font-size: 10px;
    }
  </style>
</head>

<body>
  <div id="map"></div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <script>
    (function () {
      var latitude = ${latitude};
      var longitude = ${longitude};

      if (typeof L === 'undefined') {
        document.getElementById('map').innerHTML =
          '<div style="padding:20px;font-family:sans-serif">' +
          'Não foi possível carregar o mapa. Verifique sua conexão.' +
          '</div>';
        return;
      }

      var map = L.map('map', {
        zoomControl: true,
        attributionControl: true
      }).setView([latitude, longitude], 16);

      L.tileLayer(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">' +
            'OpenStreetMap</a>'
        }
      ).addTo(map);

      L.circleMarker([latitude, longitude], {
        radius: 9,
        color: '#FFFFFF',
        weight: 3,
        fillColor: '#087EAD',
        fillOpacity: 1
      })
      .addTo(map)
      .bindPopup('Localização do chamado');

      setTimeout(function () {
        map.invalidateSize();
      }, 300);
    })();
  </script>
</body>
</html>`;
}

export function MapaOcorrencia({
  coordenadas,
}: MapaOcorrenciaProps) {
  const latitude = coordenadas.latitude;
  const longitude = coordenadas.longitude;

  const html = useMemo(
    () => criarHtmlMapa(latitude, longitude),
    [latitude, longitude],
  );

  return (
    <View style={styles.container}>
      <WebView
        style={styles.mapa}
        source={{
          html,
          baseUrl: 'https://localhost',
        }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        mixedContentMode="compatibility"
        onError={(event) => {
          console.error(
            '[MapaOcorrencia] erro ao carregar WebView:',
            event.nativeEvent.description,
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 280,
    overflow: 'hidden',
    backgroundColor: '#E8EDF0',
  },

  mapa: {
    flex: 1,
    backgroundColor: '#E8EDF0',
  },
});