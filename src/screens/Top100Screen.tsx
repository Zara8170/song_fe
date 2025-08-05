import React from 'react';
import { SafeAreaView, StatusBar, Text, View } from 'react-native';
import { styles } from './MainScreen.styles';

const Top100Screen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#23292e" />
      <View style={styles.centerContainer}>
        <Text style={styles.developmentText}>🎵</Text>
        <Text style={styles.developmentTitle}>Top 100</Text>
        <Text style={styles.developmentSubtitle}>
          인기 노래 순위를 준비 중입니다
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Top100Screen;
