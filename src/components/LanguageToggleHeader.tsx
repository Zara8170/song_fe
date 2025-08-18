import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { styles } from './LanguageToggleHeader.styles';

const LanguageToggleHeader: React.FC = () => {
  const { titleLanguage, setTitleLanguage } = useLanguage();

  const toggleLanguage = async () => {
    try {
      // 언어 토글
      if (titleLanguage === 'korean') {
        // 현재 한글이면 → 일본어(한자)로 변경
        await setTitleLanguage('japanese');
      } else {
        // 현재 일본어이면 → 한글로 변경
        await setTitleLanguage('korean');
      }
    } catch (error) {
      console.error('언어 변경 실패:', error);
    }
  };

  const isKoreanMode = titleLanguage === 'korean';

  return (
    <TouchableOpacity
      style={styles.toggleContainer}
      onPress={toggleLanguage}
      activeOpacity={0.8}
    >
      <View
        style={[styles.toggleOption, isKoreanMode && styles.selectedOption]}
      >
        <Text
          style={[
            styles.toggleText,
            isKoreanMode ? styles.selectedText : styles.unselectedText,
          ]}
        >
          한글
        </Text>
      </View>
      <View
        style={[styles.toggleOption, !isKoreanMode && styles.selectedOption]}
      >
        <Text
          style={[
            styles.toggleText,
            !isKoreanMode ? styles.selectedText : styles.unselectedText,
          ]}
        >
          일본어
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LanguageToggleHeader;
