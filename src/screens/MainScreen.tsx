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
    console.log('[MainScreen] 컴포넌트 마운트: 초기 페이지 설정');
    setPage(1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (isFetchingRef.current || !hasMore) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        console.log(
          `[MainScreen] 페이지 ${page + 1} 데이터 요청 중 (size=${PAGE_SIZE})`,
        );
        const data = await fetchSongs(page, PAGE_SIZE, controller.signal);

        // API 응답 상세 정보 로깅
        console.log(`[MainScreen] API 응답 정보:
          - 현재 페이지: ${page + 1}
          - 다음 페이지 존재: ${data.next}
          - 노래 데이터 개수: ${data.dtoList.length}
        `);

        if (data.dtoList && data.dtoList.length > 0) {
          const sampleSongs = data.dtoList.slice(0, 3);
          console.log('[MainScreen] 노래 데이터 샘플 (첫 3개):');
          sampleSongs.forEach((song, idx) => {
            console.log(
              `  ${idx + 1}. ${song.title_kr} - ${song.artist_kr} (TJ: ${
                song.tj_number || 'N/A'
              }, KY: ${song.ky_number || 'N/A'})`,
            );
          });
          console.log(`  ... 외 ${data.dtoList.length - 3}개 노래`);
        }

        // 한 번만 setSongs 호출하고 로그 출력
        setSongs(prev => {
          const updatedSongs =
            page === 0 ? data.dtoList : [...prev, ...data.dtoList];
          console.log(`[MainScreen] 데이터 업데이트 완료: 
            - 현재 페이지: ${page + 1}
            - 이전 노래 수: ${prev.length}
            - 새로 로드된 노래 수: ${data.dtoList.length}
            - 누적 노래 수: ${updatedSongs.length}
            - 더 불러올 데이터: ${data.next ? '있음' : '없음'}
          `);
          return updatedSongs;
        });

        setHasMore(data.next);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error(`[MainScreen] 데이터 로드 오류:`, e);
        }
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

  const loadNextPage = () => {
    setPage(prev => prev + 1);
  };

  const handleEndReached = () => {
    if (isFetchingRef.current || loading || !hasMore) return;
    loadNextPage();
  };

  const handleContentSizeChange = (_w: number, h: number) => {
    if (h < SCREEN_HEIGHT && hasMore && !loading && !isFetchingRef.current) {
      loadNextPage();
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
