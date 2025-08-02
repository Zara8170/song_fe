import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './src/screens/MainScreen';
import SearchScreen from './src/screens/SearchScreen';
import LibraryScreen from './src/screens/LibraryScreen';
import RecommandScreen from './src/screens/RecommandScreen';
import LoginScreen from './src/screens/LoginScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FavoritesProvider } from './src/hooks/FavoritesContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { refreshAccessToken } from './src/api/auth';
import { getAccessToken } from './src/utils/tokenStorage';

const Tab = createBottomTabNavigator();

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        setLoggedIn(false);
        setLoading(false);
        return;
      }

      // 앱 시작 시 토큰 갱신 시도
      try {
        await refreshAccessToken(token);
        setLoggedIn(true);
      } catch (error) {
        // 토큰 갱신 실패 시 로그아웃 상태로 전환
        console.log('Token refresh failed on app start:', error);
        setLoggedIn(false);
      }
    } catch (error) {
      console.log('Login status check failed:', error);
      setLoggedIn(false);
    } finally {
      setLoading(false);
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
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#23292e',
        }}
      >
        <ActivityIndicator size="large" color="#7ed6f7" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        {!loggedIn ? (
          <LoginScreen onLoginSuccess={() => setLoggedIn(true)} />
        ) : (
          <FavoritesProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#23292e' }}>
              <View
                style={{
                  backgroundColor: '#23292e',
                  paddingTop: 60,
                  paddingBottom: 14,
                  paddingLeft: 18,
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 'bold',
                    letterSpacing: 1,
                  }}
                >
                  KaraSong
                </Text>
              </View>
              <NavigationContainer>
                <Tab.Navigator
                  initialRouteName="Main"
                  screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                      backgroundColor: '#23292e',
                      borderTopColor: '#23292e',
                    },
                    tabBarActiveTintColor: '#7ed6f7',
                    tabBarInactiveTintColor: '#aaa',
                    tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
                  }}
                >
                  <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{
                      tabBarLabel: '검색',
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons
                          name="search-outline"
                          color={color}
                          size={size ?? 22}
                        />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Main"
                    component={MainScreen}
                    options={{
                      tabBarLabel: '메인',
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons
                          name="home-outline"
                          color={color}
                          size={size ?? 22}
                        />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Library"
                    component={LibraryScreen}
                    options={{
                      tabBarLabel: '보관함',
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons
                          name="library-outline"
                          color={color}
                          size={size ?? 22}
                        />
                      ),
                    }}
                  />
                  <Tab.Screen
                    name="Recommand"
                    component={RecommandScreen}
                    options={{
                      tabBarLabel: '노래 추천',
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons
                          name="sparkles-outline"
                          color={color}
                          size={size ?? 22}
                        />
                      ),
                    }}
                  />
                </Tab.Navigator>
              </NavigationContainer>
            </SafeAreaView>
          </FavoritesProvider>
        )}
      </ToastProvider>
    </GestureHandlerRootView>
  );
};

export default App;
