import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  const { showToast } = useToast();

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [favorites, showToast]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const renderQuickPickItem = ({ item }: { item: RecommendationCandidate }) => (
    <TouchableOpacity style={styles.quickPickCard}>
      <Text style={styles.songTitle} numberOfLines={2}>
        {item.title_kr || item.title_jp}
      </Text>
      <Text style={styles.artistName} numberOfLines={1}>
        {item.artist_kr || item.artist}
      </Text>
      <View style={styles.karaokeCodes}>
        <Text style={styles.karaokeCode}>TJ {item.tj_number}</Text>
        <Text style={styles.karaokeCode}>KY {item.ky_number}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderThemeGroupSong = ({ item }: { item: RecommendationSong }) => (
    <TouchableOpacity style={styles.themeSongCard}>
      <View style={styles.themeSongInfo}>
        <Text style={styles.themeSongTitle} numberOfLines={1}>
          {item.title_kr || item.title_jp}
        </Text>
        <Text style={styles.themeSongArtist} numberOfLines={1}>
          {item.artist_kr || item.artist}
        </Text>
      </View>
      <View style={styles.themeKaraokeCodes}>
        <Text style={styles.themeKaraokeCode}>TJ {item.tj_number}</Text>
        <Text style={styles.themeKaraokeCode}>KY {item.ky_number}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderThemeGroup = (group: RecommendationGroup, index: number) => (
    <View key={index} style={styles.themeGroupContainer}>
      <Text style={styles.themeGroupTitle}>{group.tagline}</Text>
      <FlatList
        data={group.songs}
        renderItem={renderThemeGroupSong}
        keyExtractor={(item, idx) => `${index}-${idx}`}
        numColumns={1}
        scrollEnabled={false}
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
          onPress={loadRecommendations}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 빠른 선곡 섹션 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>빠른 선곡</Text>
        <FlatList
          data={recommendations.candidates}
          renderItem={renderQuickPickItem}
          keyExtractor={item => item.song_id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPickList}
          snapToInterval={screenWidth * 0.7 + 12}
          decelerationRate="fast"
        />
      </View>

      {/* 테마별 선곡 섹션 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>테마별 선곡</Text>
        {recommendations.groups.map((group, index) =>
          renderThemeGroup(group, index),
        )}
      </View>
    </ScrollView>
  );
};

export default RecommandScreen;
