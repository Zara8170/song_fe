import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFavorites } from '../hooks/FavoritesContext';
import { fetchSongs, Song } from '../api/song';
import FavoriteButton from '../components/FavoriteButton';

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
      style={{ backgroundColor: '#23292e' }}
      data={favoriteSongs}
      keyExtractor={item => item.songId.toString()}
      renderItem={({ item }) => {
        const tjBoxStyle = {
          backgroundColor: '#FF5703',
          borderRadius: 8,
          minWidth: 60,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          paddingVertical: 6,
          marginRight: 8,
          marginBottom: 4,
        };
        const kyBoxStyle = {
          backgroundColor: '#EB431E',
          borderRadius: 8,
          minWidth: 60,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          paddingVertical: 6,
          marginRight: 8,
          marginBottom: 4,
        };
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#23292e',
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginBottom: 8,
            }}
          >
            {/* 번호 박스 */}
            <View style={{ flexDirection: 'column', marginRight: 8 }}>
              {item.tj_number ? (
                <View style={tjBoxStyle}>
                  <Text
                    style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                  >
                    {item.tj_number}
                  </Text>
                </View>
              ) : null}
              {item.ky_number ? (
                <View style={kyBoxStyle}>
                  <Text
                    style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                  >
                    {item.ky_number}
                  </Text>
                </View>
              ) : null}
            </View>
            {/* 곡 정보 */}
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {[item.title_kr, ' - ', item.artist_kr].join('')}
              </Text>
              <Text
                style={{ color: '#aaa', fontSize: 13, marginTop: 2 }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {[item.title_jp || item.title_en, ' - ', item.artist].join('')}
              </Text>
            </View>
            <FavoriteButton songId={item.songId.toString()} />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
});

export default FavoritesScreen;
