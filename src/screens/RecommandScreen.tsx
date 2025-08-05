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
  requestRecommendation,
  RecommendationResponse,
  RecommendationCandidate,
  RecommendationGroup,
  RecommendationSong,
} from '../api/song';
import styles from './RecommandScreenStyles';
import { useFavorites } from '../hooks/FavoritesContext';
import { useToast } from '../contexts/ToastContext';

const { width: screenWidth } = Dimensions.get('window');

const RecommandScreen = () => {
  const { favorites } = useFavorites();
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();

  const quickPickListRef = useRef<FlatList>(null);
  const themeListRefs = useRef<{ [key: number]: FlatList | null }>({});

  const loadRecommendations = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const favoriteIds = favorites
          .map(song => song.songId)
          .filter(id => !Number.isNaN(id));

        const data = await requestRecommendation(favoriteIds);
        setRecommendations(data);
      } catch (error: any) {
        if (error.message?.includes('사용자 정보를 찾을 수 없습니다')) {
          showToast('사용자 정보가 없습니다. 다시 로그인해주세요.');
        } else {
          showToast('추천을 가져오는 데 실패했습니다.');
        }
      } finally {
        if (isRefresh) {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [favorites, showToast],
  );

  const onRefresh = useCallback(() => {
    loadRecommendations(true);

    setTimeout(() => {
      quickPickListRef.current?.scrollToOffset({ offset: 0, animated: false });

      Object.values(themeListRefs.current).forEach(ref => {
        if (ref) {
          ref.scrollToOffset({ offset: 0, animated: false });
        }
      });
    }, 100);
  }, [loadRecommendations]);

  useEffect(() => {
    loadRecommendations(false);
  }, [loadRecommendations]);

  const renderQuickPickPage = ({
    item,
  }: {
    item: RecommendationCandidate[];
  }) => (
    <View style={styles.quickPickPage}>
      {item.map((song, songIndex) => (
        <TouchableOpacity key={songIndex} style={styles.themeSongCard}>
          <View style={styles.themeSongInfo}>
            <Text style={styles.themeSongTitle} numberOfLines={1}>
              {song.title_jp || song.title_en}
            </Text>
            <Text style={styles.themeSongArtist} numberOfLines={1}>
              {song.artist || song.artist_kr}
            </Text>
          </View>
          <View style={styles.themeKaraokeCodes}>
            {song.tj_number && (
              <Text style={styles.themeKaraokeCodeTJ}>TJ {song.tj_number}</Text>
            )}
            {song.ky_number && (
              <Text style={styles.themeKaraokeCodeKY}>KY {song.ky_number}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderThemeGroupSong = ({ item }: { item: RecommendationSong }) => (
    <TouchableOpacity style={styles.quickPickCard}>
      <Text style={styles.songTitle} numberOfLines={2}>
        {item.title_jp || item.title_en}
      </Text>
      <Text style={styles.artistName} numberOfLines={1}>
        {item.artist || item.artist_kr}
      </Text>
      <View style={styles.karaokeCodes}>
        {item.tj_number && (
          <Text style={styles.karaokeCodeTJ}>TJ {item.tj_number}</Text>
        )}
        {item.ky_number && (
          <Text style={styles.karaokeCodeKY}>KY {item.ky_number}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const chunkArray = (array: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const renderThemeGroup = (group: RecommendationGroup, index: number) => (
    <View key={index} style={styles.themeGroupContainer}>
      <Text style={styles.themeGroupTitle}>{group.tagline}</Text>
      <FlatList
        ref={el => {
          themeListRefs.current[index] = el;
        }}
        data={group.songs}
        renderItem={renderThemeGroupSong}
        keyExtractor={(item, idx) => `${index}-${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.themeSongList}
        snapToInterval={screenWidth * 0.7 + 12}
        decelerationRate="fast"
        nestedScrollEnabled={true}
      />
    </View>
  );

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
          onPress={() => loadRecommendations(false)}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 전체 컨텐츠를 하나의 배열로 구성
  const contentData = [
    { type: 'quickPick', data: chunkArray(recommendations.candidates, 4) },
    ...recommendations.groups.map((group, index) => ({
      type: 'themeGroup',
      data: group,
      index,
    })),
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
    } else {
      return (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>테마별 선곡</Text>
          {renderThemeGroup(item.data, item.index)}
        </View>
      );
    }
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
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default RecommandScreen;
