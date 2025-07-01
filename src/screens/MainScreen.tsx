import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { fetchSongs, Song } from '../api/song';
import { styles } from './MainScreen.styles';
import TopButton from '../components/TopButton';
import { useNavigation } from '@react-navigation/native';

const PAGE_SIZE = 20;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MainScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);
  const [endReachedCalled, setEndReachedCalled] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [showTopButton, setShowTopButton] = useState(false);

  const navigation = useNavigation();

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

  const renderItem = ({ item }: { item: Song }) => {
    const title = item.title_jp || item.title_en || '';
    return (
      <View style={styles.row}>
        <Text style={styles.id}>{item.tj_number}</Text>
        <Text style={styles.id}>{item.ky_number}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
    );
  };

  const keyExtractor = (item: Song) => item.songId.toString();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader} />
      <StatusBar barStyle="light-content" backgroundColor="#23292e" />
      <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#2d3436',
            borderRadius: 8,
            height: 50,
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SearchScreen' as never)}
        >
          <Text style={{ color: '#aaa', fontSize: 16 }}>
            검색어를 입력하세요
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerId}>TJ</Text>
        <Text style={styles.headerId}>KY</Text>
        <Text style={styles.headerTitle}>곡 이름</Text>
        <Text style={styles.headerArtist}>가수명</Text>
      </View>
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        data={songs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
