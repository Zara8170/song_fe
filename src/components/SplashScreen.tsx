import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface SplashScreenProps {
  loading?: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ loading = true }) => {
  return (
    <View style={styles.container}>
      {/* 앱 아이콘 영역 */}
      <View style={styles.iconContainer}>
        <View style={styles.appIcon}>
          {/* 앱 아이콘을 텍스트로 표현 (실제 앱에서는 이미지 사용) */}
          <Text style={styles.iconText}>🎵</Text>
        </View>
        <Text style={styles.appName}>UtaBox</Text>
      </View>

      {/* 로딩 인디케이터 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7ed6f7" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7ed6f7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 60,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7ed6f7',
    marginTop: 16,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
