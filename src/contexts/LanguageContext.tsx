import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  LanguageSettings,
  TitleLanguage,
  ArtistLanguage,
  loadLanguageSettings,
  saveLanguageSettings,
} from '../utils/languageStorage';

interface LanguageContextType {
  titleLanguage: TitleLanguage;
  artistLanguage: ArtistLanguage;
  setTitleLanguage: (language: TitleLanguage) => Promise<void>;
  setArtistLanguage: (language: ArtistLanguage) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [titleLanguage, setTitleLanguageState] =
    useState<TitleLanguage>('korean');
  const [artistLanguage, setArtistLanguageState] =
    useState<ArtistLanguage>('korean');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await loadLanguageSettings();
      setTitleLanguageState(settings.titleLanguage);
      setArtistLanguageState(settings.artistLanguage);
    } catch (error) {
      console.error('Failed to load language settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTitleLanguage = async (language: TitleLanguage) => {
    try {
      const newSettings: LanguageSettings = {
        titleLanguage: language,
        artistLanguage,
      };
      await saveLanguageSettings(newSettings);
      setTitleLanguageState(language);
    } catch (error) {
      console.error('Failed to save title language:', error);
      throw error;
    }
  };

  const setArtistLanguage = async (language: ArtistLanguage) => {
    try {
      const newSettings: LanguageSettings = {
        titleLanguage,
        artistLanguage: language,
      };
      await saveLanguageSettings(newSettings);
      setArtistLanguageState(language);
    } catch (error) {
      console.error('Failed to save artist language:', error);
      throw error;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        titleLanguage,
        artistLanguage,
        setTitleLanguage,
        setArtistLanguage,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
