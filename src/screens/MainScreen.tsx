import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { fetchSongs, Song } from '../api/song';
import TopButton from '../components/TopButton';
import { styles } from './MainScreen.styles';

const PAGE_SIZE = 20;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MainScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'TJ' | 'KY'>('ALL');

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

  const renderItem = ({ item }: { item: Song }) => {
    const tjBoxStyle = {
      backgroundColor: '#FF5703',
      borderRadius: 8,
      minWidth: 60,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 4,
    };
    const kyBoxStyle = {
      backgroundColor: '#EB431E',
      borderRadius: 8,
      minWidth: 60,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 4,
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#23292e',
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 8,
        }}
      >
        {/* 번호 박스 */}
        {filter === 'ALL' && (
          <View style={{ flexDirection: 'column', marginRight: 8 }}>
            {item.tj_number ? (
              <View style={tjBoxStyle}>
                <Text
                  style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                >
                  {item.tj_number}
                </Text>
              </View>
            ) : null}
            {item.ky_number ? (
              <View style={kyBoxStyle}>
                <Text
                  style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                >
                  {item.ky_number}
                </Text>
              </View>
            ) : null}
          </View>
        )}
        {filter === 'TJ' && item.tj_number && (
          <View style={tjBoxStyle}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              {item.tj_number}
            </Text>
          </View>
        )}
        {filter === 'KY' && item.ky_number && (
          <View style={kyBoxStyle}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
              {item.ky_number}
            </Text>
          </View>
        )}
        {/* 곡 정보 */}
        <View
          style={{ flex: 1, marginLeft: 4, minWidth: 0, overflow: 'hidden' }}
        >
          <Text
            style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {[item.title_kr, ' - ', item.artist_kr].join('')}
          </Text>
          <Text
            style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {[item.title_jp || item.title_en, ' - ', item.artist].join('')}
          </Text>
        </View>
        {/* 즐겨찾기 아이콘 자리(추후 구현) */}
        <Text style={{ marginLeft: 8, fontSize: 26, color: '#fff' }}>☆</Text>
      </View>
    );
  };

  const keyExtractor = (item: Song) => item.songId.toString();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader} />
      <StatusBar barStyle="light-content" backgroundColor="#23292e" />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 12,
        }}
      >
        {['ALL', 'TJ', 'KY'].map(type => (
          <Text
            key={type}
            onPress={() => setFilter(type as 'ALL' | 'TJ' | 'KY')}
            style={{
              backgroundColor: filter === type ? '#444' : '#23292e',
              color: filter === type ? '#7ed6f7' : '#aaa',
              borderRadius: 16,
              paddingHorizontal: 18,
              paddingVertical: 6,
              marginHorizontal: 4,
              fontWeight: 'bold',
              fontSize: 15,
              overflow: 'hidden',
            }}
          >
            {type === 'ALL' ? 'TJ/KY' : type}
          </Text>
        ))}
      </View>
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        data={filteredSongs}
        renderItem={renderItem}
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
