import { InputMatricula } from '@/components/atoms/InputMatricula';
import { InputPassword } from '@/components/atoms/InputPassword';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { theme } from '@/constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginOperadorScreen() {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  function handleLogin() {
    console.log('Login com:', matricula, senha);
    router.push('/chamados');
  }

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      {/* Topo maior exclusivo para a tela de Login com o degradê e o brasão */}
      <ImageBackground 
        source={require('@/assets/images/degrade-registro.png')} // Caminho da imagem do degradê
        style={styles.headerContainer}
        resizeMode="cover"
      >
        <Image
          source={require('@/assets/images/brasao-registro.png')}
          style={styles.brasao}
          resizeMode="contain"
        />
      </ImageBackground>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Bem-vindo de volta!</Text>

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

          <TouchableOpacity style={styles.forgotPasswordButton} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton label="Entrar" onPress={handleLogin} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    width: '100%',
    height: 340, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  brasao: {
    width: 140,
    height: 140,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    gap: 16,
    marginBottom: 12,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 24,
  },
});