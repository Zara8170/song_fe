import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { searchSongs, fetchSongs, Song } from '../api/song';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SongListItem from '../components/SongListItem';
// import TopButton from '../components/TopButton';
import SearchTypeDropdown, {
  SearchTargetType,
} from '../components/SearchTypeDropdown';
import styles from './SearchScreen.styles';
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

const SEARCH_TYPE_LABELS: Record<SearchTargetType, string> = {
  ALL: '통합',
  TITLE: '제목',
  ARTIST: '가수',
};

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState<TabType>('ALL');
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(true);
  // const [showTopButton, setShowTopButton] = useState(false);
  const [searchType, setSearchType] = useState<SearchTargetType>('ALL');
  const [showSearchTypeDropdown, setShowSearchTypeDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  const flatListRef = useRef<FlatList>(null);
  const tabAnim = useRef(new Animated.Value(0)).current;
  const isFetchingRef = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevQueryRef = useRef('');
  const { showToast } = useToast();

  const loadAllSongs = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    const controller = new AbortController();

    try {
      const data = await fetchSongs(page, PAGE_SIZE, controller.signal);

      setAllSongs(prev =>
        page === 1 ? data.dtoList : [...prev, ...data.dtoList],
      );
      setHasMore(data.next);

      if (data.next) {
        setPage(prev => prev + 1);
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error(`[SearchScreen] 데이터 로드 오류:`, e);
        showToast('노래 목록을 불러오는 데 실패했습니다.');
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [page, hasMore, showToast]);

  const handleSearch = useCallback(
    async (reset = true, customQuery?: string) => {
      const searchValue = customQuery ?? query;
      if (!searchValue.trim()) {
        setHasSearched(false);
        setSearchResults([]);
        return;
      }
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await searchSongs(
          searchValue,
          reset ? 1 : searchPage,
          PAGE_SIZE,
          searchType,
        );
        setSearchResults(prev =>
          reset ? data.dtoList : [...prev, ...data.dtoList],
        );
        setSearchHasMore(data.next);
        setSearchPage(reset ? 2 : searchPage + 1);
        if (reset)
          flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
      } catch (e) {
        showToast('검색 중 오류가 발생했습니다.');
        setSearchHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [query, searchPage, searchType, showToast],
  );

  const handleRealtimeSearch = useCallback(
    (searchValue: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const hasKorean = (text: string) => {
        const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
        return koreanRegex.test(text);
      };

      const trimmedText = searchValue.trim();
      let shouldSearch = false;

      if (trimmedText.length === 0) {
        shouldSearch = false;
      } else if (hasKorean(trimmedText)) {
        shouldSearch = trimmedText.length >= 1;
      } else {
        shouldSearch = trimmedText.length >= 2;
      }

      if (!shouldSearch) {
        setHasSearched(false);
        setSearchResults([]);
        prevQueryRef.current = '';
        return;
      }

      if (prevQueryRef.current === searchValue.trim()) {
        return;
      }

      debounceTimeoutRef.current = setTimeout(() => {
        prevQueryRef.current = searchValue.trim();
        handleSearch(true, searchValue);
      }, 300);
    },
    [handleSearch],
  );

  useEffect(() => {
    handleRealtimeSearch(query);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, handleRealtimeSearch]);

  useEffect(() => {
    if (query.trim() && hasSearched) {
      setSearchResults([]);
      setSearchPage(1);
      setSearchHasMore(true);
      prevQueryRef.current = '';
      handleSearch(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType]);

  useEffect(() => {
    loadAllSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Animated.spring(tabAnim, {
      toValue: TAB_TYPES.indexOf(filter),
      useNativeDriver: false,
      friction: 7,
    }).start();
  }, [filter, tabAnim]);

  useFocusEffect(useCallback(() => {}, []));

  const handleEndReached = () => {
    if (loading) return;

    if (hasSearched && query.trim()) {
      if (!searchHasMore) return;
      handleSearch(false);
    } else {
      if (isFetchingRef.current || !hasMore) return;
      loadAllSongs();
    }
  };

  const handleContentSizeChange = (_w: number, h: number) => {
    if (
      !hasSearched &&
      h < SCREEN_HEIGHT &&
      hasMore &&
      !loading &&
      !isFetchingRef.current
    ) {
      loadAllSongs();
    }
  };

  // const handleScroll = (event: any) => {
  //   const offsetY = event.nativeEvent.contentOffset.y;
  //   setShowTopButton(offsetY > 100);
  // };

  // const handlePressTop = () => {
  //   flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  // };

  const handleSearchTypePress = () => {
    setDropdownPosition({ x: 12, y: 65 });
    setShowSearchTypeDropdown(true);
  };

  const currentData = hasSearched && query.trim() ? searchResults : allSongs;

  const filteredData = Array.isArray(currentData)
    ? currentData.filter(song => {
        if (filter === 'TJ') return !!song.tj_number;
        if (filter === 'KY') return !!song.ky_number;
        return true;
      })
    : [];

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
      <StatusBar barStyle="light-content" backgroundColor="#23292e" />

      {/* 검색바 */}
      <View style={styles.searchBoxWrapper}>
        <View style={styles.searchContainer}>
          {/* 검색 타입 선택 버튼 */}
          <TouchableOpacity
            style={styles.searchTypeButton}
            onPress={handleSearchTypePress}
          >
            <Text style={styles.searchTypeText}>
              {SEARCH_TYPE_LABELS[searchType]}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#7ed6f7"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder={
              searchType === 'ALL'
                ? '곡명, 가수로 검색하세요'
                : searchType === 'TITLE'
                ? '곡명으로 검색하세요'
                : '가수명으로 검색하세요'
            }
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={text => {
              setQuery(text);
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss();
              const trimmedQuery = query.trim();
              const hasKorean = (text: string) => {
                const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
                return koreanRegex.test(text);
              };

              const shouldSearch = hasKorean(trimmedQuery)
                ? trimmedQuery.length >= 1
                : trimmedQuery.length >= 2;

              if (shouldSearch) {
                handleSearch();
              }
            }}
            returnKeyType="search"
          />
        </View>
      </View>

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
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.songId.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        onContentSizeChange={handleContentSizeChange}
        // onScroll={handleScroll}
        // scrollEventThrottle={16}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* 검색 결과 없음 메시지 */}
      {!loading &&
        filteredData.length === 0 &&
        query.trim() !== '' &&
        hasSearched && (
          <View style={styles.noResultWrapper}>
            <Text style={styles.noResultText}>검색 결과가 없습니다.</Text>
          </View>
        )}

      {/* 맨 위로 버튼 */}
      {/* <TopButton visible={showTopButton} onPress={handlePressTop} /> */}

      {/* 검색 타입 선택 드롭다운 */}
      <SearchTypeDropdown
        visible={showSearchTypeDropdown}
        onClose={() => setShowSearchTypeDropdown(false)}
        currentType={searchType}
        onSelect={type => setSearchType(type)}
        position={dropdownPosition}
      />
    </SafeAreaView>
  );
};

export default SearchScreen;
