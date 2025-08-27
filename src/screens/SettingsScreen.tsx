import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { deleteMember } from '../api/auth';
import { styles } from './SettingsScreen.styles';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { showToast } = useToast();
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setShowLogoutModal(false);
      showToast('로그아웃되었습니다.');
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      try {
        await AsyncStorage.removeItem('token');
        setShowLogoutModal(false);
        logout();
        showToast('로그아웃되었습니다.');
      } catch (storageError) {
        setShowLogoutModal(false);
        showToast('로그아웃 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
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
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('LanguageSettings')}
          >
            <Ionicons name="language-outline" size={24} color="#7ed6f7" />
            <Text style={[styles.menuText, { color: '#7ed6f7' }]}>
              언어 설정
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowLogoutModal(true)}
          >
            <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>로그아웃</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={() => setShowDeleteModal(true)}
          >
            <Ionicons name="person-remove-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {/* 여기에 다른 메뉴 항목들이 추가될 수 있습니다 */}
        </View>
      </View>

      <DeleteConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="로그아웃"
        message="로그아웃하시겠습니까?"
        confirmText="로그아웃"
        cancelText="취소"
        loading={false}
      />

      <DeleteConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까?"
        confirmText="탈퇴"
        cancelText="취소"
        loading={isDeleting}
      />
    </View>
  );
};

export default SettingsScreen;
