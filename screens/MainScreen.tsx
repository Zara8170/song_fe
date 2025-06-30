import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { fetchSongs, Song } from '../api/song';

const PAGE_SIZE = 20;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MainScreen = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);
  const [endReachedCalled, setEndReachedCalled] = useState(false);

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
      <View style={styles.tableHeader}>
        <Text style={styles.headerId}>TJ</Text>
        <Text style={styles.headerId}>KY</Text>
        <Text style={styles.headerTitle}>곡 이름</Text>
        <Text style={styles.headerArtist}>가수명</Text>
      </View>

      <FlatList
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
        initialNumToRender={PAGE_SIZE}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color="#7ed6f7" style={{ margin: 16 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  topHeader: {
    height: 36,
    backgroundColor: '#23292e',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerId: {
    color: '#7ed6f7',
    width: 60,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    flex: 2,
    fontWeight: 'bold',
  },
  headerArtist: {
    color: '#fff',
    flex: 1.5,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#23292e',
  },
  id: {
    color: '#7ed6f7',
    width: 60,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    flex: 2,
    fontWeight: 'bold',
  },
  artist: {
    color: '#fff',
    flex: 1.5,
    fontWeight: 'bold',
  },
});

export default MainScreen;
