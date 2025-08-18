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
  RecommendationResponse,
  RecommendationCandidate,
  RecommendationGroup,
  RecommendationSong,
  createRecommendationJob,
  getRecommendationJobStatus,
  fetchLatestRecommendation,
} from '../api/song';
import styles from './RecommandScreenStyles';
import { useFavorites } from '../hooks/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';

const { width: screenWidth } = Dimensions.get('window');

const RecommandScreen = () => {
  const { favorites } = useFavorites();
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { showToast } = useToast();
  const { titleLanguage } = useLanguage();

  const quickPickListRef = useRef<FlatList>(null);
  const themeListRefs = useRef<{ [key: number]: FlatList | null }>({});
  const isActiveRef = useRef<boolean>(true);

  const startRecommendationJobAndPoll = useCallback(
    async (options?: { isRefresh?: boolean; keepSpinner?: boolean }) => {
      const { isRefresh = false, keepSpinner = false } = options || {};
      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else if (keepSpinner) {
          setIsLoading(true);
        }

        const favoriteIds = favorites
          .map(song => song.songId)
          .filter(id => !Number.isNaN(id));

        const job = await createRecommendationJob(favoriteIds, {
          source: isRefresh ? 'manual' : 'manual',
          strategy: 'default',
        });

        let attempts = 0;
        const maxAttempts = 30; // ~1분(2s 간격)
        const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

        while (attempts < maxAttempts) {
          if (!isActiveRef.current) {
            return;
          }
          attempts += 1;
          const status = await getRecommendationJobStatus(job.jobId);

          if (status.status === 'succeeded' && status.result) {
            if (!isActiveRef.current) return;
            setRecommendations(status.result);
            if (!isRefresh) setIsLoading(false);
            setIsRefreshing(false);
            return;
          }
          if (status.status === 'failed') {
            if (!isActiveRef.current) return;
            if (!isRefresh) setIsLoading(false);
            setIsRefreshing(false);
            showToast(
              '추천 생성을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.',
            );
            return;
          }

          await delay(2000);
        }

        // 타임아웃
        if (!isActiveRef.current) return;
        if (!isRefresh) setIsLoading(false);
        setIsRefreshing(false);
        showToast('추천 생성이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
      } catch (error: any) {
        if (!isActiveRef.current) return;
        if (!isRefresh) setIsLoading(false);
        setIsRefreshing(false);
        if (error.message?.includes('사용자 정보를 찾을 수 없습니다')) {
          showToast('사용자 정보가 없습니다. 다시 로그인해주세요.');
        } else {
          showToast('추천을 가져오는 데 실패했습니다.');
        }
      }
    },
    [favorites, showToast],
  );

  const onRefresh = useCallback(() => {
    startRecommendationJobAndPoll({ isRefresh: true, keepSpinner: false });

    setTimeout(() => {
      quickPickListRef.current?.scrollToOffset({ offset: 0, animated: false });

      Object.values(themeListRefs.current).forEach(ref => {
        if (ref) {
          ref.scrollToOffset({ offset: 0, animated: false });
        }
      });
    }, 100);
  }, [startRecommendationJobAndPoll]);

  useEffect(() => {
    isActiveRef.current = true;
    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const latest = await fetchLatestRecommendation();
        if (!isActiveRef.current) return;
        if (latest) {
          setRecommendations(latest);
          setIsLoading(false);
          // 최신 표시 후 백그라운드 갱신
          startRecommendationJobAndPoll({
            isRefresh: false,
            keepSpinner: false,
          });
        } else {
          // 최신 결과가 없으면 스피너 유지하며 생성 + 폴링
          await startRecommendationJobAndPoll({
            isRefresh: false,
            keepSpinner: true,
          });
        }
      } catch (_e) {
        if (!isActiveRef.current) return;
        // 최신 불러오기 실패 시 바로 생성 + 폴링으로 폴백
        await startRecommendationJobAndPoll({
          isRefresh: false,
          keepSpinner: true,
        });
      }
    };
    bootstrap();
    return () => {
      isActiveRef.current = false;
    };
  }, [startRecommendationJobAndPoll]);

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
              {titleLanguage === 'korean'
                ? song.title_kr
                : song.title_jp || song.title_en}
            </Text>
            {titleLanguage === 'korean' && song.title_en && (
              <Text style={styles.themeSongYomi} numberOfLines={1}>
                {song.title_en}
              </Text>
            )}
            {song.title_yomi && titleLanguage === 'japanese' && (
              <Text style={styles.themeSongYomi} numberOfLines={1}>
                {song.title_yomi}
              </Text>
            )}
            <Text style={styles.themeSongArtist} numberOfLines={1}>
              {titleLanguage === 'korean'
                ? `${song.artist_kr} (${song.artist})`
                : song.artist}
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
        {titleLanguage === 'korean'
          ? item.title_kr
          : item.title_jp || item.title_en}
      </Text>
      {titleLanguage === 'korean' && item.title_en && (
        <Text style={styles.songYomi} numberOfLines={1}>
          {item.title_en}
        </Text>
      )}
      {item.title_yomi && titleLanguage === 'japanese' && (
        <Text style={styles.songYomi} numberOfLines={1}>
          {item.title_yomi}
        </Text>
      )}
      <Text style={styles.artistName} numberOfLines={1}>
        {titleLanguage === 'korean'
          ? `${item.artist_kr} (${item.artist})`
          : item.artist}
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
          onPress={() =>
            startRecommendationJobAndPoll({
              isRefresh: false,
              keepSpinner: true,
            })
          }
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
          {item.data.map((group: RecommendationGroup, index: number) => (
            <View key={index} style={styles.themeGroupContainer}>
              <Text style={styles.themeGroupTitle}>{group.tagline}</Text>
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
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

export default RecommandScreen;
