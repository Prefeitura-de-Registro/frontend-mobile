import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? 'app',
  slug: config.slug ?? 'app',
  ios: {
    ...config.ios,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'Mostramos sua posição no mapa de chamados.',
    },
  },
  android: {
    ...config.android,
    permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
  },
  plugins: [...(config.plugins ?? []), 
    ['expo-build-properties', { android: { usesCleartextTraffic: true } }],
  ], 
});