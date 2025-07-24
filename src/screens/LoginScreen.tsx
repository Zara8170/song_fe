import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import { loginWithGoogle } from '../api/auth';
import { useToast } from '../contexts/ToastContext';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { showToast } = useToast();

  useEffect(() => {
    console.log(
      'Configuring Google Sign-In with webClientId:',
      GOOGLE_WEB_CLIENT_ID,
    );
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const signIn = async () => {
    const loginResponse = await loginWithGoogle();
    if (loginResponse) {
      showToast('로그인되었습니다.');
      onLoginSuccess();
    } else {
      showToast('로그인에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23292e',
  },
});

export default LoginScreen;
