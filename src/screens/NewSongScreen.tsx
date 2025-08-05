import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { styles } from './MainScreen.styles';

const NewSongScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#23292e" />
      <View style={styles.centerContainer}>
        <Text style={styles.developmentText}>🆕</Text>
        <Text style={styles.developmentTitle}>신곡</Text>
        <Text style={styles.developmentSubtitle}>
          최신 노래들을 준비 중입니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NewSongScreen;
