import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { loginWithGoogle } from '../api/auth';
import { useToast } from '../contexts/ToastContext';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { styles } from './LoginScreen.styles';
import { requestRecommendation } from '../api/song';

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

  const startRecommendationInBackground = () => {
    requestRecommendation([]).catch(error => {
      console.log('초기 추천 로직 실행 중 에러:', error);
    });
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        showToast('Google 로그인에서 토큰을 받지 못했습니다.');
        return;
      }

      const loginResponse = await loginWithGoogle(idToken);

      if (loginResponse) {
        showToast('로그인되었습니다.');
        onLoginSuccess();
        startRecommendationInBackground();
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error?.code === 'SIGN_IN_CANCELLED') {
        showToast('로그인이 취소되었습니다.');
      } else if (error?.code === 'IN_PROGRESS') {
        showToast('로그인이 진행 중입니다. 잠시 기다려주세요.');
      } else if (error?.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        showToast('Google Play Services를 사용할 수 없습니다.');
      } else {
        showToast('로그인에 실패했습니다.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#23292e"
        translucent={false}
      />
      {/* 앱 아이콘 */}
      <View style={styles.iconContainer}>
        <View style={styles.iconPlaceholder}>
          <Text style={styles.iconText}>♪</Text>
        </View>
      </View>

      {/* 앱 타이틀 */}
      <Text style={styles.appTitle}>KaraSong</Text>
      <Text style={styles.appSubtitle}>당신의 음악 여정을 시작하세요</Text>

      {/* 구글 로그인 버튼 */}
      <TouchableOpacity style={styles.googleButton} onPress={signIn}>
        <View style={styles.googleButtonContent}>
          <View style={styles.googleIconContainer}>
            <Text style={styles.googleIcon}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>Google로 로그인</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;
