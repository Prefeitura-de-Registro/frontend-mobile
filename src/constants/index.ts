import { colors } from './colors';
import { metrics } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  ...typography,
  ...metrics,
};

export type Theme = typeof theme;
