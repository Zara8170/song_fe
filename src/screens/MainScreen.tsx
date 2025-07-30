import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { styles } from './MainScreen.styles';

const MainScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#23292e" />
      <View style={styles.centerContainer}>
        <Text style={styles.developmentText}>🚧</Text>
        <Text style={styles.developmentTitle}>개발 대기중</Text>
        <Text style={styles.developmentSubtitle}>
          새로운 기능을 준비 중입니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
