import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './MainScreen.styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface MainScreenProps {
  navigation: any;
}

const MainScreen = ({ navigation }: MainScreenProps) => {
  const menuItems = [
    {
      id: 1,
      title: '노래검색',
      icon: 'search-outline',
      color: '#7ed6f7',
      route: 'SearchTab',
    },
    {
      id: 2,
      title: '보관함',
      icon: 'folder-outline',
      color: '#ff7675',
      route: 'LibraryTab',
    },
    {
      id: 3,
      title: '노래 추천',
      icon: 'sparkles-outline',
      color: '#a29bfe',
      route: 'RecommandTab',
    },
    {
      id: 4,
      title: 'Top 100',
      icon: 'trophy-outline',
      color: '#feca57',
      route: 'Top100',
    },
    {
      id: 5,
      title: '신곡',
      icon: 'musical-notes-outline',
      color: '#ff9ff3',
      route: 'NewSong',
    },
  ];

  const handleMenuPress = (route: string) => {
    navigation.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#23292e"
        translucent={false}
      />
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: Platform.OS === 'android' ? 30 : 10,
          },
        ]}
      >
        <Text style={styles.appTitle}>KaraSong</Text>
      </View>
      <View style={styles.menuContainer}>
        <Text style={styles.welcomeTitle}>환영합니다!</Text>
        <Text style={styles.welcomeSubtitle}>원하는 메뉴를 선택해주세요</Text>

        <View style={styles.menuGrid}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Ionicons name={item.icon} size={30} color={item.color} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
