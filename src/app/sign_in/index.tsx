import { InputMatricula } from '@/components/atoms/InputMatricula';
import { InputPassword } from '@/components/atoms/InputPassword';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { FooterLogo } from '@/components/organisms/FooterLogo';
import { theme } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
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

export default function LoginOperadorScreen() {
  const { signIn } = useAuth();
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleLogin() {
    setErro(null);
    setEnviando(true);

    try {
      await signIn(matricula, senha);
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message ?? 'Matrícula ou senha inválidos.';
      setErro(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.mainContainer}>
      
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

      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo-fala-registro.png')}
            style={styles.logoFalaRegistro}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>
            <Text style={styles.titleBold}>Bem-vindo</Text> de volta!
          </Text>

          <View style={styles.inputGroup}>
            <InputMatricula
              value={matricula}
              onChangeText={setMatricula}
              placeholder="Matrícula"
            />

            <InputPassword
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
            />

            {erro && <Text style={styles.erroText}>{erro}</Text>}

            <TouchableOpacity style={styles.forgotPasswordButton} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonWrapper}>
            <PrimaryButton label="Entrar" onPress={handleLogin} loading={enviando} />
          </View>
        </View>
        
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

  scrollContainer: {
    flexGrow: 1,
    zIndex: 1, 
    marginTop: 130
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80, 
    marginBottom: 10,
  },
  logoFalaRegistro: {
    width: 300, 
    height: 90,  
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.regular,
    fontSize: 24, 
    color: '#333333',
    marginBottom: 40,
    textAlign: 'center',
  },
  titleBold: {
    fontFamily: theme.fonts.bold,
    color: '#0072AE',
  },
  inputGroup: {
    width: '100%',
    gap: 16,
    marginBottom: 12,
  },
  erroText: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    color: '#4A9BC4', 
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 24,
    
  },
  footerContainer: {
    paddingBottom: 10, 
    alignItems: 'center',
  },
});