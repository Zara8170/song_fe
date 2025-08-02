import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../screens/LibraryScreen.styles';
import { Playlist } from '../api/playlist';

interface PlaylistItemProps {
  playlist: Playlist;
  favoriteCount: number;
  onPress: (playlist: Playlist) => void;
  onMenuPress: (playlist: Playlist, event: any) => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  playlist,
  favoriteCount,
  onPress,
  onMenuPress,
}) => {
  const isLikedPlaylist = playlist.title === '좋아요 표시한 음악';

  return (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => onPress(playlist)}
    >
      <View style={styles.playlistInfo}>
        <Ionicons
          name={isLikedPlaylist ? 'heart' : 'musical-notes'}
          size={24}
          color="#7ed6f7"
          style={styles.playlistIcon}
        />
        <View style={styles.playlistTextContainer}>
          <Text style={styles.playlistTitle}>{playlist.title}</Text>
          {playlist.description && !isLikedPlaylist && (
            <Text style={styles.playlistDescription}>
              {playlist.description}
            </Text>
          )}
          <Text style={styles.playlistSongCount}>
            {isLikedPlaylist ? favoriteCount : playlist.songCount}곡
          </Text>
        </View>
      </View>

      <View style={styles.playlistActions}>
        {!isLikedPlaylist && (
          <TouchableOpacity
            style={styles.playlistMenuButton}
            onPress={event => onMenuPress(playlist, event)}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PlaylistItem;
