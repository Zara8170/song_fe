import React, { useState, useEffect } from 'react';
import { View, AppState } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import RecommandScreen from './src/screens/RecommandScreen';
import Top100Screen from './src/screens/Top100Screen';
import NewSongScreen from './src/screens/NewSongScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LanguageSettingsScreen from './src/screens/LanguageSettingsScreen';
import LoginScreen from './src/screens/LoginScreen';

import { FavoritesProvider } from './src/hooks/FavoritesContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import LanguageToggleHeader from './src/components/LanguageToggleHeader';
import { refreshAccessToken } from './src/api/auth';
import { getAccessToken } from './src/utils/tokenStorage';

const Stack = createStackNavigator();

// 커스텀 테마 설정 - 흰색 화면 방지
const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#23292e',
    card: '#23292e',
    primary: '#7ed6f7',
  },
};

const appStyles = {
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#23292e' },
};

const HeaderRight = () => <LanguageToggleHeader />;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [_tokenRefreshing, setTokenRefreshing] = useState(false);

  const handleLogout = async () => {
    setLoggedIn(false);
  };

  const checkLoginStatus = async () => {
    try {
      setTokenRefreshing(true);
      const token = await getAccessToken();

      if (!token) {
        setLoggedIn(false);
        setLoading(false);
        setTokenRefreshing(false);
        return;
      }

      try {
        console.log('토큰 갱신 시도 중...');
        await refreshAccessToken(token);
        console.log('토큰 갱신 성공!');
        setLoggedIn(true);
      } catch (error) {
        console.log('Token refresh failed on app start:', error);
        setLoggedIn(false);
      }
    } catch (error) {
      console.log('Login status check failed:', error);
      setLoggedIn(false);
    } finally {
      setLoading(false);
      setTokenRefreshing(false);
      // 로딩 완료 후 스플래시 스크린 숨기기
      SplashScreen.hide();
    }
  };

  useEffect(() => {
    checkLoginStatus();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkLoginStatus();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 네이티브 스플래시 스크린 사용으로 인해 별도 로딩 화면 불필요

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={appStyles.flex}>
        <ToastProvider>
          {loading ? null : !loggedIn ? (
            <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />
          ) : (
            <AuthProvider logout={handleLogout}>
              <LanguageProvider>
                <FavoritesProvider>
                  <View style={appStyles.container}>
                    <NavigationContainer theme={CustomTheme}>
                      <Stack.Navigator
                        initialRouteName="Main"
                        screenOptions={{
                          headerShown: false,
                          animation: 'none',
                        }}
                      >
                        <Stack.Screen
                          name="Main"
                          component={MainScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="SearchTab"
                          component={SearchScreen}
                          options={{
                            headerShown: true,
                            headerTitle: '노래검색',
                            headerStyle: {
                              backgroundColor: '#23292e',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                              fontWeight: 'bold',
                              fontSize: 20,
                            },
                            headerRight: HeaderRight,
                          }}
                        />
                        <Stack.Screen
                          name="LibraryTab"
                          component={LibraryScreen}
                          options={{
                            headerShown: true,
                            headerTitle: '보관함',
                            headerStyle: {
                              backgroundColor: '#23292e',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                              fontWeight: 'bold',
                            },
                          }}
                        />
                        <Stack.Screen
                          name="RecommandTab"
                          component={RecommandScreen}
                          options={{
                            headerShown: true,
                            headerTitle: '노래 추천',
                            headerStyle: {
                              backgroundColor: '#23292e',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                              fontWeight: 'bold',
                            },
                            headerRight: HeaderRight,
                          }}
                        />
                        <Stack.Screen
                          name="Top100"
                          component={Top100Screen}
                          options={{
                            headerShown: true,
                            headerTitle: 'Top 100',
                            headerStyle: {
                              backgroundColor: '#23292e',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                              fontWeight: 'bold',
                            },
                          }}
                        />
                        <Stack.Screen
                          name="NewSong"
                          component={NewSongScreen}
                          options={{
                            headerShown: true,
                            headerTitle: '신곡',
                            headerStyle: {
                              backgroundColor: '#23292e',
                            },
                            headerTintColor: '#fff',
                            headerTitleStyle: {
                              fontWeight: 'bold',
                            },
                          }}
                        />
                        <Stack.Screen
                          name="Settings"
                          component={SettingsScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                        <Stack.Screen
                          name="LanguageSettings"
                          component={LanguageSettingsScreen}
                          options={{
                            headerShown: false,
                          }}
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </View>
                </FavoritesProvider>
              </LanguageProvider>
            </AuthProvider>
          )}
        </ToastProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
