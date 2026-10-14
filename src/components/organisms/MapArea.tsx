import { ChamadoMapCard } from '@/components/molecules/ChamadoMapCard';
import { theme } from '@/constants';
import { PrioridadeChamado, TipoOcorrencia } from '@/types/chamado';
import * as Location from 'expo-location';
import { LocateFixed, Minus, Plus } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export interface PontoMapa {
  id: string;
  codigo: string; // ex: '#2026-0001'
  tempo: string; // ex: '12h'
  titulo: string;
  endereco: string;
  latitude: number;
  longitude: number;
  status: 'aberto' | 'em_atendimento' | 'concluido';
  prioridade: PrioridadeChamado;
  tipo?: TipoOcorrencia; // TODO: preencher com os valores reais de TipoOcorrencia
}

// TODO: remover quando o backend passar a mandar as coordenadas
export const PONTOS_EXEMPLO: PontoMapa[] = [
  { id: '1', codigo: '#2026-0001', tempo: '12h', titulo: 'Buraco', endereco: 'Rua das Flores, 220 - Jd. Valeri', latitude: -24.4879, longitude: -47.8438, status: 'aberto', prioridade: 'urgente' },
  { id: '2', codigo: '#2026-0002', tempo: '3h', titulo: 'Lâmpada queimada', endereco: 'Rua Tamekichi Takano, 85', latitude: -24.4925, longitude: -47.8391, status: 'em_atendimento', prioridade: 'medio' },
  { id: '3', codigo: '#2026-0003', tempo: '1d', titulo: 'Poda de árvore', endereco: 'Rua Vila Tupi, 410', latitude: -24.4852, longitude: -47.8502, status: 'aberto', prioridade: 'normal' },
  { id: '4', codigo: '#2026-0004', tempo: '2d', titulo: 'Bueiro entupido', endereco: 'Rua Vila Yoshida, 32', latitude: -24.4961, longitude: -47.8465, status: 'concluido', prioridade: 'normal' },
];

const CENTRO_INICIAL = { latitude: -24.4879, longitude: -47.8438 };

function corDoPin(p: PontoMapa) {
  if (p.status === 'concluido') return '#22C79A';
  if (p.prioridade === 'urgente') return '#E02424';
  if (p.prioridade === 'medio') return '#F5B800';
  return theme.colors.primary;
}

const HTML_MAPA = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .pin { width: 20px; height: 20px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
    .eu { width: 16px; height: 16px; border-radius: 50%; background: #1A73E8; border: 3px solid #fff; box-shadow: 0 0 0 6px rgba(26,115,232,.25); }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: false })
      .setView([${CENTRO_INICIAL.latitude}, ${CENTRO_INICIAL.longitude}], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    function post(msg) { window.ReactNativeWebView.postMessage(JSON.stringify(msg)); }

    var camada = L.layerGroup().addTo(map);

    window.setPontos = function (dados, ajustar) {
      camada.clearLayers();
      var coords = [];
      dados.forEach(function (p) {
        var icon = L.divIcon({
          className: '',
          html: '<div class="pin" style="background:' + p.cor + '"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        L.marker([p.latitude, p.longitude], { icon: icon })
          .addTo(camada)
          .on('click', function (e) {
            L.DomEvent.stopPropagation(e);
            post({ type: 'select', id: p.id });
          });
        coords.push([p.latitude, p.longitude]);
      });
      if (ajustar && coords.length > 0) {
        map.fitBounds(coords, { padding: [60, 60], maxZoom: 16 });
      }
    };

    map.on('click', function () { post({ type: 'deselect' }); });

    var eu = null;
    window.setUser = function (lat, lng, centralizar) {
      var icon = L.divIcon({ className: '', html: '<div class="eu"></div>', iconSize: [16, 16], iconAnchor: [8, 8] });
      if (eu) { eu.setLatLng([lat, lng]); } else { eu = L.marker([lat, lng], { icon: icon, interactive: false }).addTo(map); }
      if (centralizar) { map.setView([lat, lng], 16, { animate: true }); }
    };
  </script>
</body>
</html>`;

interface MapAreaProps {
  pontos: PontoMapa[];
  expandido: boolean;
  onAlternarExpandir: () => void;
  onVerDetalhes: (id: string) => void;
}

export function MapArea({ pontos, expandido, onAlternarExpandir, onVerDetalhes }: MapAreaProps) {
  const webViewRef = useRef<WebView>(null);
  const primeiroEnvio = useRef(true);
  const [mapaPronto, setMapaPronto] = useState(false);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

  const selecionado = pontos.find((p) => p.id === selecionadoId) ?? null;

  // Envia os pontos para o Leaflet sempre que a lista (filtrada) mudar
  useEffect(() => {
    if (!mapaPronto) return;
    const dados = pontos.map((p) => ({
      id: p.id,
      latitude: p.latitude,
      longitude: p.longitude,
      cor: corDoPin(p),
    }));
    // só enquadra todos os pins na primeira vez, para o mapa não "pular" enquanto digita
    const ajustar = primeiroEnvio.current;
    primeiroEnvio.current = false;
    webViewRef.current?.injectJavaScript(
      `window.setPontos(${JSON.stringify(dados)}, ${ajustar}); true;`,
    );
  }, [pontos, mapaPronto]);

  // O container mudou de tamanho: sem isso o Leaflet pode deixar faixa cinza
  useEffect(() => {
    webViewRef.current?.injectJavaScript(
      'setTimeout(function () { map.invalidateSize(); }, 100); true;',
    );
  }, [expandido]);

  async function mostrarMinhaLocalizacao(centralizar: boolean) {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const pos = await Location.getCurrentPositionAsync({});
    webViewRef.current?.injectJavaScript(
      `window.setUser(${pos.coords.latitude}, ${pos.coords.longitude}, ${centralizar}); true;`,
    );
  }

  function aoReceberMensagem(event: WebViewMessageEvent) {
    const msg = JSON.parse(event.nativeEvent.data);
    if (msg.type === 'select') {
      setSelecionadoId(msg.id);
      // o card ocupa boa parte do mapa pequeno, então expande ao selecionar
      if (!expandido) onAlternarExpandir();
    } else if (msg.type === 'deselect') {
      setSelecionadoId(null);
    }
  }

  function zoom(direcao: 'zoomIn' | 'zoomOut') {
    webViewRef.current?.injectJavaScript(`map.${direcao}(); true;`);
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={StyleSheet.absoluteFill}
        originWhitelist={['*']}
        source={{ html: HTML_MAPA, baseUrl: 'https://localhost' }}
        javaScriptEnabled
        onMessage={aoReceberMensagem}
        onLoadEnd={() => {
          setMapaPronto(true);
          mostrarMinhaLocalizacao(false);
        }}
      />

      {/* no modo expandido os botões descem para não ficar atrás da pesquisa */}
      <View style={[styles.controls, expandido && styles.controlsExpandido]}>
        <TouchableOpacity style={styles.controlButton} onPress={() => mostrarMinhaLocalizacao(true)}>
          <LocateFixed size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.zoomGroup}>
          <TouchableOpacity style={styles.zoomButton} onPress={() => zoom('zoomIn')}>
            <Plus size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.zoomButton} onPress={() => zoom('zoomOut')}>
            <Minus size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {selecionado ? (
        <ChamadoMapCard
          codigo={selecionado.codigo}
          titulo={selecionado.titulo}
          status={selecionado.status}
          prioridade={selecionado.prioridade}
          endereco={selecionado.endereco}
          tempo={selecionado.tempo}
          onFechar={() => setSelecionadoId(null)}
          onVerDetalhes={() => onVerDetalhes(selecionado.id)}
        />
      ) : (
        // TODO temporário: sem botão no design, o toque no card expande/recolhe o mapa
        <TouchableOpacity style={styles.infoCard} activeOpacity={0.8} onPress={onAlternarExpandir}>
          <Text style={styles.infoText}>
            {expandido
              ? 'Toque aqui para reduzir o mapa'
              : 'Toque em um chamado no mapa para ver mais informações'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: { position: 'absolute', right: 12, top: 16, gap: 10 },
  controlsExpandido: { top: 84 },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  zoomGroup: { borderRadius: 10, backgroundColor: '#FFFFFF', elevation: 3 },
  zoomButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  divider: { height: 1, backgroundColor: '#E5E5E5' },
  infoCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    elevation: 4,
  },
  infoText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.primary,
    textAlign: 'center',
  },
});