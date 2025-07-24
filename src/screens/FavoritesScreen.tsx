import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useFavorites } from '../hooks/FavoritesContext';
import SongListItem from '../components/SongListItem';
import styles from './FavoritesScreen.styles';
import { Song } from '../api/song';
import { useToast } from '../contexts/ToastContext';

const FavoritesScreen = () => {
  const { favorites, syncWithBackend } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await syncWithBackend();
    } catch (error) {
      showToast('즐겨찾기 목록을 새로고침하는 데 실패했습니다.');
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: Song }) => <SongListItem item={item} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.songId.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>즐겨찾기한 노래가 없습니다.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#7ed6f7"
          />
        }
      />
    </View>
  );
};

export default FavoritesScreen;
