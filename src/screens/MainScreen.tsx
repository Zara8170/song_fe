import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { fetchSongs, Song } from '../api/song';
import TopButton from '../components/TopButton';
import SongListItem from '../components/SongListItem';
import { styles } from './MainScreen.styles';
import { useToast } from '../contexts/ToastContext';

const PAGE_SIZE = 20;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const TAB_TYPES = ['ALL', 'TJ', 'KY'] as const;
type TabType = (typeof TAB_TYPES)[number];
const TAB_LABELS: Record<TabType, string> = {
  ALL: 'TJ/KY',
  TJ: 'TJ',
  KY: 'KY',
};

const MainScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<TabType>('ALL');
  const tabAnim = useRef(new Animated.Value(0)).current;

  const isFetchingRef = useRef(false);
  const flatListRef = useRef<FlatList>(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (isFetchingRef.current || !hasMore) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const data = await fetchSongs(page, PAGE_SIZE, controller.signal);
        setSongs(prev =>
          page === 1 ? data.dtoList : [...prev, ...data.dtoList],
        );
        setHasMore(data.next);
      } catch (e: any) {
        if (e.name !== 'AbortError') console.error(e);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    load();
    return () => controller.abort();
  }, [page, hasMore]);

  useEffect(() => {
    Animated.spring(tabAnim, {
      toValue: TAB_TYPES.indexOf(filter),
      useNativeDriver: false,
      friction: 7,
    }).start();
  }, [filter, tabAnim]);

  const handleEndReached = () => {
    if (isFetchingRef.current || loading || !hasMore) return;
    setPage(prev => prev + 1);
  };

  const handleContentSizeChange = (_w: number, h: number) => {
    if (h < SCREEN_HEIGHT && hasMore && !loading && !isFetchingRef.current) {
      setPage(prev => prev + 1);
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowTopButton(offsetY > 100);
  };

  const handlePressTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const filteredSongs = songs.filter(song => {
    if (filter === 'TJ') return !!song.tj_number;
    if (filter === 'KY') return !!song.ky_number;
    return true;
  });

  const keyExtractor = (item: Song) => item.songId.toString();

  const renderItem = ({ item }: { item: Song }) => (
    <SongListItem
      item={item}
      showFilter={filter}
      onFavoriteAdd={() => showToast('즐겨찾기에 추가되었습니다.')}
      onFavoriteRemove={() => showToast('즐겨찾기에서 삭제되었습니다.')}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader} />
      <StatusBar barStyle="light-content" backgroundColor="#23292e" />
      {/* 상단 Animated 탭 */}
      <View style={styles.tabBar}>
        {TAB_TYPES.map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type)}
            activeOpacity={0.7}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                filter === type ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              {TAB_LABELS[type]}
            </Text>
          </TouchableOpacity>
        ))}
        {/* Animated underline */}
        <Animated.View
          style={[
            styles.tabUnderline,
            {
              left: tabAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: ['0%', '33.33%', '66.66%'],
              }),
            },
          ]}
        />
      </View>
      {/* 리스트 */}
      <FlatList
        ref={flatListRef}
        style={styles.list}
        data={filteredSongs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : null
        }
      />
      <TopButton visible={showTopButton} onPress={handlePressTop} />
    </SafeAreaView>
  );
};

export default MainScreen;
