import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { deleteMember } from '../api/auth';
import { styles } from './SettingsScreen.styles';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { showToast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleLogout = async () => {
    try {
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      if (hasPlayServices) {
        await GoogleSignin.signOut();
      }

      await AsyncStorage.removeItem('token');
      showToast('로그아웃되었습니다.');
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      try {
        await AsyncStorage.removeItem('token');
        logout();
        showToast('로그아웃되었습니다.');
      } catch (storageError) {
        showToast('로그아웃 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#23292e"
        translucent={false}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>로그아웃</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={async () => {
              try {
                await deleteMember();

                const hasPlayServices = await GoogleSignin.hasPlayServices();
                if (hasPlayServices) {
                  await GoogleSignin.signOut();
                }

                await AsyncStorage.removeItem('token');

                showToast('회원 탈퇴가 완료되었습니다.');
                logout();
              } catch (error) {
                console.error('회원 탈퇴 에러:', error);
                showToast('회원 탈퇴 중 오류가 발생했습니다.');
              }
            }}
          >
            <Ionicons name="person-remove-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {/* 여기에 다른 메뉴 항목들이 추가될 수 있습니다 */}
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
