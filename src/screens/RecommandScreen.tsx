import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {
  CachedRecommendationResponse,
  CachedRecommendationSong,
  CachedRecommendationGroup,
  getCachedRecommendation,
  requestRecommendation,
} from '../api/song';
import styles from './RecommandScreenStyles';
import { useFavorites } from '../hooks/FavoritesContext';
import { useToast } from '../contexts/ToastContext';

const { width: screenWidth } = Dimensions.get('window');

const RecommandScreen = () => {
  const { favorites } = useFavorites();
  const [recommendations, setRecommendations] =
    useState<CachedRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();

  const quickPickListRef = useRef<FlatList>(null);
  const themeListRefs = useRef<{ [key: number]: FlatList | null }>({});
  const isActiveRef = useRef<boolean>(true);

  const loadCachedRecommendation = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        if (!isActiveRef.current) return;

        console.log('Loading cached recommendation...');
        const cachedData = await getCachedRecommendation();

        if (!isActiveRef.current) return;

        setRecommendations(cachedData);
        console.log('Cached recommendation loaded successfully');
      } catch (error: any) {
        if (!isActiveRef.current) return;

        console.error('Failed to load cached recommendation:', error);

        if (error.message?.includes('사용자 정보를 찾을 수 없습니다')) {
          showToast('사용자 정보가 없습니다. 다시 로그인해주세요.');
        } else if (error.message?.includes('HTTP error! status: 404')) {
          showToast('아직 추천 결과가 없습니다. 잠시 후 다시 시도해주세요.');
        } else {
          showToast('추천을 가져오는 데 실패했습니다.');
        }
      } finally {
        if (!isActiveRef.current) return;
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [showToast],
  );

  const refreshRecommendation = useCallback(async () => {
    try {
      if (!isActiveRef.current) return;

      // 새로운 추천 요청 (백그라운드)
      const favoriteIds = favorites
        .map(song => song.songId)
        .filter(id => !Number.isNaN(id));

      if (favoriteIds.length > 0) {
        console.log('Requesting new recommendation...');
        await requestRecommendation(favoriteIds);
        console.log('New recommendation requested successfully');

        // 새로운 추천 요청 후 캐시된 결과 로드
        await loadCachedRecommendation(true);
      } else {
        showToast('즐겨찾기에 노래를 추가한 후 추천을 받으실 수 있습니다.');
      }
    } catch (error: any) {
      console.error('Failed to refresh recommendation:', error);
      showToast('추천 갱신에 실패했습니다.');
      setIsRefreshing(false);
    }
  }, [favorites, showToast, loadCachedRecommendation]);

  const onRefresh = useCallback(() => {
    refreshRecommendation();

    setTimeout(() => {
      quickPickListRef.current?.scrollToOffset({ offset: 0, animated: false });

      Object.values(themeListRefs.current).forEach(ref => {
        if (ref) {
          ref.scrollToOffset({ offset: 0, animated: false });
        }
      });
    }, 100);
  }, [refreshRecommendation]);

  useEffect(() => {
    isActiveRef.current = true;

    // 화면이 마운트되면 캐시된 추천 결과를 로드
    loadCachedRecommendation();

    return () => {
      isActiveRef.current = false;
    };
  }, [loadCachedRecommendation]);

  const renderQuickPickPage = ({
    item,
  }: {
    item: CachedRecommendationSong[];
  }) => (
    <View style={styles.quickPickPage}>
      {item.map((song, songIndex) => (
        <TouchableOpacity key={songIndex} style={styles.themeSongCard}>
          <View style={styles.themeSongInfo}>
            <Text style={styles.themeSongTitle} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={styles.themeSongArtist} numberOfLines={1}>
              {song.artist}
            </Text>
            {song.score && (
              <Text style={styles.themeSongYomi} numberOfLines={1}>
                추천도: {(song.score * 100).toFixed(0)}%
              </Text>
            )}
            {song.similarity_score && (
              <Text style={styles.themeSongYomi} numberOfLines={1}>
                유사도: {(song.similarity_score * 100).toFixed(0)}%
              </Text>
            )}
          </View>
          {song.reason && (
            <View style={styles.themeKaraokeCodes}>
              <Text style={styles.themeKaraokeCodeTJ} numberOfLines={2}>
                {song.reason}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderThemeGroupSong = ({
    item,
  }: {
    item: CachedRecommendationSong;
  }) => (
    <TouchableOpacity style={styles.quickPickCard}>
      <Text style={styles.songTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.artistName} numberOfLines={1}>
        {item.artist}
      </Text>
      {item.similarity_score && (
        <View style={styles.karaokeCodes}>
          <Text style={styles.karaokeCodeTJ}>
            유사도: {(item.similarity_score * 100).toFixed(0)}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  // removed unused renderThemeGroup helper

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4FC3F7" />
        <Text style={styles.loadingText}>맞춤 추천을 생성하고 있습니다...</Text>
      </View>
    );
  }

  if (!recommendations) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>추천을 불러오지 못했습니다.</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadCachedRecommendation()}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const contentData = [
    { type: 'quickPick', data: chunkArray(recommendations.candidates, 4) },
    { type: 'themeSection', data: recommendations.groups },
  ];

  const renderContent = ({ item }: { item: any }) => {
    if (item.type === 'quickPick') {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>빠른 선곡</Text>
          <FlatList
            ref={quickPickListRef}
            data={item.data}
            renderItem={renderQuickPickPage}
            keyExtractor={(pageItem, idx) => `quick-pick-page-${idx}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPickList}
            snapToInterval={screenWidth * 0.85}
            decelerationRate="fast"
            nestedScrollEnabled={true}
          />
        </View>
      );
    } else if (item.type === 'themeSection') {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>테마별 선곡</Text>
          {item.data.map((group: CachedRecommendationGroup, index: number) => (
            <View key={index} style={styles.themeGroupContainer}>
              <Text style={styles.themeGroupTitle}>{group.name}</Text>
              <FlatList
                ref={el => {
                  themeListRefs.current[index] = el;
                }}
                data={group.songs}
                renderItem={renderThemeGroupSong}
                keyExtractor={(songItem, idx) => `${index}-${idx}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.themeSongList}
                snapToInterval={screenWidth * 0.7 + 12}
                decelerationRate="fast"
                nestedScrollEnabled={true}
              />
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <FlatList
      style={styles.container}
      data={contentData}
      renderItem={renderContent}
      keyExtractor={(item, index) => `content-${index}`}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={['#4FC3F7']}
          tintColor="#4FC3F7"
        />
      }
      contentContainerStyle={styles.contentContainer}
    />
  );
};

export default RecommandScreen;
