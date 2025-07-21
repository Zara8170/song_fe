import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { searchSongs, Song } from '../api/song';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SongListItem from '../components/SongListItem';
import styles from './SearchScreen.styles';
import { useToast } from '../contexts/ToastContext';

const PAGE_SIZE = 20;
const RECENT_KEY = 'recent_search_keywords';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const { showToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      setQuery('');
      setResults([]);
      setPage(1);
      setHasMore(true);
      setError('');
    }, []),
  );

  React.useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then(data => {
      if (data) setRecent(JSON.parse(data));
    });
  }, []);

  const saveRecent = async (keyword: string) => {
    let arr = [keyword, ...recent.filter(k => k !== keyword)];
    if (arr.length > 10) arr = arr.slice(0, 10);
    setRecent(arr);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(arr));
  };

  const handleClearRecent = async () => {
    setRecent([]);
    await AsyncStorage.removeItem(RECENT_KEY);
  };

  const handleSearch = async (reset = true, customQuery?: string) => {
    const searchValue = customQuery ?? query;
    if (!searchValue.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchSongs(
        searchValue,
        reset ? 1 : page,
        PAGE_SIZE,
        'ALL',
      );
      setResults(reset ? data.dtoList : [...results, ...data.dtoList]);
      setHasMore(data.next);
      setPage(reset ? 2 : page + 1);
      if (reset)
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      saveRecent(searchValue);
    } catch (e) {
      setError('검색 중 오류가 발생했습니다.');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    if (!hasMore || loading) return;
    handleSearch(false);
  };

  const handleRecentPress = (keyword: string) => {
    setQuery(keyword);
    handleSearch(true, keyword);
    Keyboard.dismiss();
  };

  const renderItem = ({ item }: { item: Song }) => (
    <SongListItem
      item={item}
      showFilter="ALL"
      onFavoriteAdd={() => showToast('즐겨찾기에 추가되었습니다.')}
      onFavoriteRemove={() => showToast('즐겨찾기에서 삭제되었습니다.')}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBoxWrapper}>
        <View style={styles.searchBoxInner}>
          <TextInput
            style={styles.searchInput}
            placeholder="곡명, 가수로 검색하세요"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              handleSearch();
            }}
            returnKeyType="search"
          />
          <View style={styles.searchIconWrapper}>
            <View style={styles.searchIconBg}>
              <Ionicons
                name="search"
                size={22}
                color="#23292e"
                onPress={() => {
                  Keyboard.dismiss();
                  handleSearch();
                }}
              />
            </View>
          </View>
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {results.length === 0 && recent.length > 0 && query.trim() === '' && (
        <View style={styles.recentWrapper}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>최근 검색어</Text>
            <Text onPress={handleClearRecent} style={styles.recentClear}>
              초기화
            </Text>
          </View>
          {recent.map(keyword => (
            <Text
              key={keyword}
              onPress={() => handleRecentPress(keyword)}
              style={styles.recentKeyword}
            >
              #{keyword}
            </Text>
          ))}
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={results}
        renderItem={renderItem}
        keyExtractor={item => item.songId.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator color="#7ed6f7" style={{ margin: 16 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {!loading && results.length === 0 && query.trim() !== '' && !error && (
        <View style={styles.noResultWrapper}>
          <Text style={styles.noResultText}>검색 결과가 없습니다.</Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
