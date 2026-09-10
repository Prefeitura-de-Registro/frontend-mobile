import { theme } from '@/constants';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  card: {
    marginTop: -20,
    marginHorizontal: 24,
    backgroundColor: '#F6F6F6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    gap: 20,
    
  },
  chamadoHeader: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE2E8',
  },
  chamadoTitulo: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.primary,
  },
  chamadoCodigo: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#333',
  },
  section: {
    gap: 8,
    
  },
  sectionTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 15,
    color: '#222',
  },
  sectionSubtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: '#777',
    marginTop: -4,
  },
  radioGroup: {
    gap: 2,
  },
  buttonWrapper: {
    marginTop: 8,
  },
});