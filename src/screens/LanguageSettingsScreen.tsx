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
  const { titleLanguage, artistLanguage, setTitleLanguage, setArtistLanguage } =
    useLanguage();
  const { showToast } = useToast();

  const handleTitleLanguageChange = async (language: 'japanese' | 'korean') => {
    try {
      await setTitleLanguage(language);
      showToast(
        `제목 언어가 ${
          language === 'japanese' ? '한자' : '한글'
        }로 변경되었습니다.`,
      );
    } catch (error) {
      showToast('설정 변경에 실패했습니다.');
    }
  };

  const handleArtistLanguageChange = async (language: 'english' | 'korean') => {
    try {
      await setArtistLanguage(language);
      showToast(
        `가수 이름이 ${
          language === 'english' ? '영어' : '한글'
        }로 변경되었습니다.`,
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
        {/* 제목 언어 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제목 언어</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionItem,
                titleLanguage === 'japanese' && styles.selectedOption,
              ]}
              onPress={() => handleTitleLanguageChange('japanese')}
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
                  일본어 한자 제목 표시
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
              onPress={() => handleTitleLanguageChange('korean')}
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
                  한글 제목 표시
                </Text>
              </View>
              {titleLanguage === 'korean' && (
                <Ionicons name="checkmark-circle" size={20} color="#7ed6f7" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 가수 이름 언어 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>가수 이름</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionItem,
                artistLanguage === 'english' && styles.selectedOption,
              ]}
              onPress={() => handleArtistLanguageChange('english')}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    artistLanguage === 'english' && styles.selectedOptionText,
                  ]}
                >
                  영어
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    artistLanguage === 'english' &&
                      styles.selectedOptionDescription,
                  ]}
                >
                  영어 가수 이름 표시
                </Text>
              </View>
              {artistLanguage === 'english' && (
                <Ionicons name="checkmark-circle" size={20} color="#7ed6f7" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionItem,
                styles.lastOptionItem,
                artistLanguage === 'korean' && styles.selectedOption,
              ]}
              onPress={() => handleArtistLanguageChange('korean')}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionText,
                    artistLanguage === 'korean' && styles.selectedOptionText,
                  ]}
                >
                  한글
                </Text>
                <Text
                  style={[
                    styles.optionDescription,
                    artistLanguage === 'korean' &&
                      styles.selectedOptionDescription,
                  ]}
                >
                  한글 가수 이름 표시
                </Text>
              </View>
              {artistLanguage === 'korean' && (
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
