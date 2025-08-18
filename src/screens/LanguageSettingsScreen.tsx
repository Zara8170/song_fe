import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { styles } from './LanguageSettingsScreen.styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface LanguageSettingsScreenProps {
  navigation: any;
}

const LanguageSettingsScreen: React.FC<LanguageSettingsScreenProps> = ({
  navigation,
}) => {
  const { titleLanguage, setTitleLanguage } = useLanguage();
  const { showToast } = useToast();

  const handleLanguageChange = async (language: 'japanese' | 'korean') => {
    try {
      await setTitleLanguage(language);
      showToast(
        `언어가 ${language === 'japanese' ? '한자' : '한글'}로 변경되었습니다.`,
      );
    } catch (error) {
      showToast('설정 변경에 실패했습니다.');
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
        <Text style={styles.headerTitle}>언어 설정</Text>
      </View>

      <View style={styles.content}>
        {/* 언어 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>언어 설정</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionItem,
                titleLanguage === 'japanese' && styles.selectedOption,
              ]}
              onPress={() => handleLanguageChange('japanese')}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    titleLanguage === 'japanese' && styles.selectedOptionText,
                  ]}
                >
                  한자
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    titleLanguage === 'japanese' &&
                      styles.selectedOptionDescription,
                  ]}
                >
                  일본어 한자 제목과 영어 가수명 표시
                </Text>
              </View>
              {titleLanguage === 'japanese' && (
                <Ionicons name="checkmark-circle" size={20} color="#7ed6f7" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionItem,
                styles.lastOptionItem,
                titleLanguage === 'korean' && styles.selectedOption,
              ]}
              onPress={() => handleLanguageChange('korean')}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    titleLanguage === 'korean' && styles.selectedOptionText,
                  ]}
                >
                  한글
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    titleLanguage === 'korean' &&
                      styles.selectedOptionDescription,
                  ]}
                >
                  한글 제목과 가수명 표시
                </Text>
              </View>
              {titleLanguage === 'korean' && (
                <Ionicons name="checkmark-circle" size={20} color="#7ed6f7" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LanguageSettingsScreen;
