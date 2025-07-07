/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
// @ts-ignore
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './src/screens/MainScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FavoritesProvider } from './src/hooks/FavoritesContext';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
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
            노래방 일본노래 검색
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
              name="Favorites"
              component={FavoritesScreen}
              options={{
                tabBarLabel: '즐겨찾기',
                tabBarIcon: ({ focused, size, color: _color }) => (
                  <Icon
                    name="star"
                    color={focused ? 'gold' : 'gray'}
                    size={size ?? 22}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </FavoritesProvider>
  );
};

export default App;
