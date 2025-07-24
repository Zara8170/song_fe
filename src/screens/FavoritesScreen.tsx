import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { fetchMyLikes, Song } from '../api/song';
import SongListItem from '../components/SongListItem';
import { useFavorites } from '../hooks/FavoritesContext';
import styles from './FavoritesScreen.styles';
import { useToast } from '../contexts/ToastContext';

const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    if (favorites.length === 0) {
      setSongs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchMyLikes()
      .then(setSongs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [favorites]);

  const favoriteSongs = songs;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (favoriteSongs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>즐겨찾기한 곡이 없습니다.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Song }) => (
    <SongListItem
      item={item}
      showFilter="ALL"
      onFavoriteAdd={() => showToast('즐겨찾기에 추가되었습니다.')}
      onFavoriteRemove={() => showToast('즐겨찾기에서 삭제되었습니다.')}
    />
  );

  return (
    <FlatList
      style={styles.list}
      data={songs}
      keyExtractor={item => item.songId.toString()}
      renderItem={renderItem}
    />
  );
};

export default FavoritesScreen;
