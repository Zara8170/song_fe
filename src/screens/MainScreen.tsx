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
import { styles } from './MainScreen.styles';
import FavoriteButton from '../components/FavoriteButton';

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
  const [endReachedCalled, setEndReachedCalled] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [showTopButton, setShowTopButton] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleEndReached = () => {
    if (isFetchingRef.current || loading || !hasMore || endReachedCalled)
      return;
    setEndReachedCalled(true);
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
        renderItem={({ item }) => {
          return (
            <View style={styles.resultItem}>
              {/* 번호 박스 */}
              {filter === 'ALL' && (
                <View style={styles.numberColumn}>
                  {item.tj_number ? (
                    <View style={styles.tjBox}>
                      <Text style={styles.songTitle}>{item.tj_number}</Text>
                    </View>
                  ) : null}
                  {item.ky_number ? (
                    <View style={styles.kyBox}>
                      <Text style={styles.songTitle}>{item.ky_number}</Text>
                    </View>
                  ) : null}
                </View>
              )}
              {filter === 'TJ' && item.tj_number && (
                <View style={styles.numberColumn}>
                  <View style={styles.tjBox}>
                    <Text style={styles.songTitle}>{item.tj_number}</Text>
                  </View>
                </View>
              )}
              {filter === 'KY' && item.ky_number && (
                <View style={styles.numberColumn}>
                  <View style={styles.kyBox}>
                    <Text style={styles.songTitle}>{item.ky_number}</Text>
                  </View>
                </View>
              )}
              {/* 곡 정보 */}
              <View style={styles.songInfo}>
                <Text
                  style={styles.songTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {[item.title_kr, ' - ', item.artist_kr].join('')}
                </Text>
                <Text
                  style={styles.songSub}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {[item.title_jp || item.title_en, ' - ', item.artist].join(
                    '',
                  )}
                </Text>
              </View>
              {/* 즐겨찾기 버튼 */}
              <FavoriteButton songId={item.songId.toString()} />
            </View>
          );
        }}
        keyExtractor={keyExtractor}
        removeClippedSubviews={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onMomentumScrollBegin={() => {
          setEndReachedCalled(false);
        }}
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        initialNumToRender={PAGE_SIZE}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color="#7ed6f7" style={{ margin: 16 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <TopButton visible={showTopButton} onPress={handlePressTop} />
    </SafeAreaView>
  );
};

export default MainScreen;
