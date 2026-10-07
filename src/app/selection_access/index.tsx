import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { SecondaryButton } from '@/components/atoms/SecondaryButton';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { theme } from '@/constants';
import { useRouter } from 'expo-router';
import { EyeOff } from 'lucide-react-native';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      
      {/* --- ONDAS DE FUNDO --- */}
      <Image
        source={require('../../../assets/images/onda-topo.png')}
        style={styles.ondaTopo}
        resizeMode="cover" 
      />
      <Image
        source={require('../../../assets/images/onda-rodape.png')}
        style={styles.ondaInferior}
        resizeMode="contain" 
      />

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        
        {/* Logo ajustada com as mesmas medidas do Login */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo-fala-registro.png')}
            style={styles.logoFalaRegistro}
            resizeMode="contain"
          />
        </View>

        {/* Textos de Apresentação */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Ajude a cuidar{'\n'}da <Text style={styles.titleBold}>sua Cidade!</Text>
          </Text>
          <Text style={styles.subtitle}>
            Registre ocorrências e acompanhe suas{'\n'}solicitações de forma{' '}
            <Text style={styles.subtitleBold}>simples</Text> e{' '}
            <Text style={styles.subtitleBold}>rápida.</Text>
          </Text>
        </View>

        {/* Grupo de Botões */}
        <View style={styles.actionsContainer}>
          <PrimaryButton 
            label="Criar uma conta" 
            onPress={() => console.log('Navegar para Tela de Cadastro')} 
          />
          
          <SecondaryButton 
            label="Logar" 
            onPress={() => router.push('/sign_in')} // Redireciona para a tela de login
          />

          {/* Divisor "ou" */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botão Escuro - Entrar Anônimo */}
          <TouchableOpacity 
            style={styles.anonymousButton} 
            activeOpacity={0.8}
            onPress={() => console.log('Acesso Anônimo clicado!')}
          >
            <EyeOff color="#FFFFFF" size={20} style={styles.anonymousIcon} />
            <Text style={styles.anonymousButtonText}>Entrar Anônimo</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé Institucional */}
        <View style={styles.footerContainer}>
          <FooterLogo />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
  },
  /* --- ESTILOS DAS ONDAS (IGUAIS AO LOGIN) --- */
  ondaTopo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 130,
    height: 180, 
    zIndex: 0,
  },
  ondaInferior: {
    position: 'absolute',
    bottom: -15,   
    right: -37,    
    width: 220,    
    height: 220,
    zIndex: 0,
  },
  /* --- ESTILOS DO CONTEÚDO (IGUAIS AO LOGIN) --- */
  scrollContainer: {
    flexGrow: 1,
    zIndex: 1, 
    marginTop: 130, // Aplicado o marginTop do Login
    justifyContent: 'space-between', 
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80, 
    marginBottom: 10,
  },
  logoFalaRegistro: {
    width: 300, // Ajustado para os 300 de largura
    height: 90, // Ajustado para os 90 de altura
  },
  textContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontFamily: theme.fonts.regular,
    fontSize: 28,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 34,
  },
  titleBold: {
    fontFamily: theme.fonts.bold,
    color: '#0072AE',
  },
  subtitle: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  subtitleBold: {
    fontFamily: theme.fonts.bold,
    color: '#333333',
  },
  actionsContainer: {
    paddingHorizontal: 28,
    width: '100%',
    gap: 16, 
    marginTop: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D0DCDD',
  },
  dividerText: {
    fontFamily: theme.fonts.regular,
    color: '#888888',
    marginHorizontal: 12,
    fontSize: 14,
  },
  anonymousButton: {
    backgroundColor: '#333333',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  anonymousIcon: {
    marginRight: 10,
  },
  anonymousButtonText: {
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  footerContainer: {
    paddingBottom: 10, // Atualizado para o paddingBottom do Login
    marginTop: 20,
    alignItems: 'center',
  },
});