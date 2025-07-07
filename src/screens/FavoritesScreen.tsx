import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useFavorites } from '../hooks/FavoritesContext';
import { fetchSongs, Song } from '../api/song';
import FavoriteButton from '../components/FavoriteButton';
import styles from './FavoritesScreen.styles';

const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs(1, 100)
      .then(data => {
        setSongs(data.dtoList);
      })
      .finally(() => setLoading(false));
  }, []);

  const favoriteSongs = useMemo(
    () => songs.filter(song => favorites.includes(song.songId.toString())),
    [songs, favorites],
  );

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
          <FavoriteButton songId={item.songId.toString()} />
        </View>
      )}
    />
  );
};

export default FavoritesScreen;
