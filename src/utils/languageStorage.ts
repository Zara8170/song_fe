import AsyncStorage from '@react-native-async-storage/async-storage';

export type TitleLanguage = 'japanese' | 'korean'; // 한자 | 한글
export type ArtistLanguage = 'english' | 'korean'; // 영어 | 한글

export interface LanguageSettings {
  titleLanguage: TitleLanguage;
  artistLanguage: ArtistLanguage;
}

const LANGUAGE_SETTINGS_KEY = 'language_settings';

const defaultSettings: LanguageSettings = {
  titleLanguage: 'japanese', // 기본값: 한자 (기존 그대로)
  artistLanguage: 'english', // 기본값: 영어 (기존 그대로)
};

export const saveLanguageSettings = async (
  settings: LanguageSettings,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save language settings:', error);
    throw error;
  }
};

export const loadLanguageSettings = async (): Promise<LanguageSettings> => {
  try {
    const settingsJson = await AsyncStorage.getItem(LANGUAGE_SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    return defaultSettings;
  } catch (error) {
    console.error('Failed to load language settings:', error);
    return defaultSettings;
  }
};

export const clearLanguageSettings = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LANGUAGE_SETTINGS_KEY);
  } catch (error) {
    console.error('Failed to clear language settings:', error);
    throw error;
  }
};
