import React, { useState, useEffect } from 'react';
import { View, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
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
import SplashScreen from './src/components/SplashScreen';
import { FavoritesProvider } from './src/hooks/FavoritesContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { refreshAccessToken } from './src/api/auth';
import { getAccessToken } from './src/utils/tokenStorage';

const Stack = createStackNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenRefreshing, setTokenRefreshing] = useState(false);

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

  if (loading) {
    return <SplashScreen loading={tokenRefreshing} />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          {!loggedIn ? (
            <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />
          ) : (
            <AuthProvider logout={handleLogout}>
              <LanguageProvider>
                <FavoritesProvider>
                  <View style={{ flex: 1, backgroundColor: '#23292e' }}>
                    <NavigationContainer>
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
                            headerShown: false,
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
