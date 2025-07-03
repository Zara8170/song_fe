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
import FavoriteButton from '../components/FavoriteButton';

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

  // 탭 이동 시 상태 초기화 (진입 시 초기화)
  useFocusEffect(
    useCallback(() => {
      setQuery('');
      setResults([]);
      setPage(1);
      setHasMore(true);
      setError('');
    }, []),
  );

  // 최근 검색어 불러오기
  React.useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then(data => {
      if (data) setRecent(JSON.parse(data));
    });
  }, []);

  // 최근 검색어 저장
  const saveRecent = async (keyword: string) => {
    let arr = [keyword, ...recent.filter(k => k !== keyword)];
    if (arr.length > 10) arr = arr.slice(0, 10);
    setRecent(arr);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(arr));
  };

  // 최근 검색어 전체 삭제
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
        <View style={{ flexDirection: 'column', marginRight: 8 }}>
          {item.tj_number ? (
            <View style={tjBoxStyle}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {item.tj_number}
              </Text>
            </View>
          ) : null}
          {item.ky_number ? (
            <View style={kyBoxStyle}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                {item.ky_number}
              </Text>
            </View>
          ) : null}
        </View>
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
        {/* 즐겨찾기 버튼 */}
        <FavoriteButton songId={item.songId.toString()} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#23292e' }}>
      {/* 검색창 */}
      <View style={{ paddingHorizontal: 12, marginTop: 16, marginBottom: 16 }}>
        <View style={{ position: 'relative', width: '100%' }}>
          <TextInput
            style={{
              width: '100%',
              backgroundColor: '#363c44',
              borderRadius: 12,
              height: 48,
              color: '#fff',
              paddingHorizontal: 16,
              fontSize: 16,
              fontWeight: 'bold',
              paddingRight: 48, // 아이콘 영역 확보
            }}
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
          {/* 검색 아이콘 */}
          <View
            style={{
              position: 'absolute',
              right: 8,
              top: 6,
              height: 36,
              width: 36,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                backgroundColor: '#7ed6f7',
                borderRadius: 18,
                width: 36,
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
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
      {error ? (
        <Text
          style={{ color: '#ff7675', textAlign: 'center', marginBottom: 8 }}
        >
          {error}
        </Text>
      ) : null}
      {/* 최근 검색어: 검색 결과 없을 때만 노출 */}
      {results.length === 0 && recent.length > 0 && query.trim() === '' && (
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Text style={{ color: '#aaa', fontWeight: 'bold', fontSize: 15 }}>
              최근 검색어
            </Text>
            <Text
              onPress={handleClearRecent}
              style={{
                color: '#7ed6f7',
                fontWeight: 'bold',
                fontSize: 14,
                padding: 4,
              }}
            >
              초기화
            </Text>
          </View>
          {recent.map(keyword => (
            <Text
              key={keyword}
              onPress={() => handleRecentPress(keyword)}
              style={{
                color: '#4b8cff',
                fontWeight: 'bold',
                fontSize: 16,
                height: 36,
                lineHeight: 36,
                marginBottom: 4,
                borderRadius: 8,
                paddingLeft: 4,
              }}
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
      {/* 검색 결과 없음 안내 */}
      {!loading && results.length === 0 && query.trim() !== '' && !error && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Text style={{ color: '#aaa', fontSize: 16 }}>
            검색 결과가 없습니다.
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
