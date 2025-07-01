import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { searchSongs, Song } from '../api/song';
import { searchStyles } from './SearchScreen.styles';

const PAGE_SIZE = 20;

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSearch = async (reset = true) => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchSongs(query, reset ? 1 : page, PAGE_SIZE);
      setResults(reset ? data.dtoList : [...results, ...data.dtoList]);
      setHasMore(data.next);
      setPage(reset ? 2 : page + 1);
      if (reset)
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
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

  const renderItem = ({ item }: { item: Song }) => {
    const title = item.title_jp || item.title_en || '';
    return (
      <View style={searchStyles.row}>
        <Text style={searchStyles.id}>{item.tj_number}</Text>
        <Text style={searchStyles.id}>{item.ky_number}</Text>
        <Text style={searchStyles.title}>{title}</Text>
        <Text style={searchStyles.artist}>{item.artist}</Text>
      </View>
    );
  };

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchBar}>
        <TextInput
          style={searchStyles.input}
          placeholder="검색어를 입력하세요"
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => {
            Keyboard.dismiss();
            handleSearch();
          }}
          returnKeyType="search"
        />
      </View>
      {error ? <Text style={searchStyles.error}>{error}</Text> : null}
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
    </View>
  );
};

export default SearchScreen;
