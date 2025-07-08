import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { fetchSongsByIds, Song } from '../api/song';
import FavoriteButton from '../components/FavoriteButton';
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
    fetchSongsByIds(favorites)
      .then(data => setSongs(data))
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

  return (
    <FlatList
      style={styles.list}
      data={favoriteSongs}
      keyExtractor={item => item.songId.toString()}
      renderItem={({ item }) => (
        <View style={styles.resultItem}>
          {/* 번호 박스 */}
          <View style={styles.numberColumn}>
            {item.tj_number ? (
              <View style={styles.tjBox}>
                <Text style={styles.songTitle}>{item.tj_number}</Text>
              </View>
            ) : null}
            {item.ky_number ? (
              <View style={styles.kyBox}>
                <Text style={styles.songTitle}>{item.ky_number}</Text>
              </View>
            ) : null}
          </View>
          {/* 곡 정보 */}
          <View style={styles.songInfo}>
            <Text
              style={styles.songTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {[item.title_kr, ' - ', item.artist_kr].join('')}
            </Text>
            <Text style={styles.songSub} numberOfLines={1} ellipsizeMode="tail">
              {[item.title_jp || item.title_en, ' - ', item.artist].join('')}
            </Text>
          </View>
          <FavoriteButton
            songId={item.songId.toString()}
            onAdd={() => showToast('즐겨찾기에 추가되었습니다.')}
            onRemove={() => showToast('즐겨찾기에서 삭제되었습니다.')}
          />
        </View>
      )}
    />
  );
};

export default FavoritesScreen;
