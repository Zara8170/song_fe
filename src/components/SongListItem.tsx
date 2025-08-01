import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Song } from '../api/song';
import FavoriteButton from './FavoriteButton';
import styles from './SongListItem.styles';
import { Marquee } from '@animatereactnative/marquee';
import { useFavorites } from '../hooks/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { Playlist, getMyPlaylists, addSongToPlaylist } from '../api/playlist';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SongListItemProps {
  item: Song;
  showFilter?: 'ALL' | 'TJ' | 'KY';
  onFavoriteAdd?: () => void;
  onFavoriteRemove?: () => void;
  hidePlaylistButton?: boolean;
}

const SongListItem: React.FC<SongListItemProps> = ({
  item,
  showFilter = 'ALL',
  onFavoriteAdd,
  onFavoriteRemove,
  hidePlaylistButton = false,
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { showToast } = useToast();

  // View와 텍스트 크기 측정을 위한 상태
  const [songInfoWidth, setSongInfoWidth] = useState(0);
  const [mainTitleWidth, setMainTitleWidth] = useState(0);
  const [subTitleWidth, setSubTitleWidth] = useState(0);

  // 플레이리스트 관련 상태
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const isCurrentlyFavorite = isFavorite(item.songId);

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite) {
      removeFavorite(item.songId);
      onFavoriteRemove?.();
    } else {
      addFavorite(item);
      onFavoriteAdd?.();
    }
  };

  // 플레이리스트 모달 열기
  const openPlaylistModal = async () => {
    try {
      setLoading(true);
      setPlaylists([]); // 플레이리스트 상태 초기화
      setSelectedPlaylistId(null);
      setShowPlaylistModal(true); // 모달을 먼저 열어서 로딩 상태를 보여줌

      const allPlaylists = await getMyPlaylists();

      // "좋아요 표시한 음악" 플레이리스트는 제외
      const filteredPlaylists = allPlaylists.filter(
        playlist => playlist.title !== '좋아요 표시한 음악',
      );

      if (filteredPlaylists.length === 0) {
        setPlaylists([]); // 빈 배열로 설정하여 빈 상태 메시지 표시
      } else {
        setPlaylists(filteredPlaylists);
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
      showToast('플레이리스트 목록을 불러오는 데 실패했습니다.');
      setShowPlaylistModal(false); // 에러가 발생하면 모달 닫기
    } finally {
      setLoading(false);
    }
  };

  // 플레이리스트 모달 닫기
  const closePlaylistModal = () => {
    setShowPlaylistModal(false);
    setSelectedPlaylistId(null);
  };

  // 선택한 플레이리스트에 곡 추가
  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) {
      Alert.alert('알림', '플레이리스트를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      await addSongToPlaylist(selectedPlaylistId, { songId: item.songId });
      const selectedPlaylist = playlists.find(
        p => p.playlistId === selectedPlaylistId,
      );
      showToast(`"${selectedPlaylist?.title}"에 곡이 추가되었습니다.`);
      closePlaylistModal();
    } catch (error) {
      console.error('Failed to add song to playlist:', error);
      showToast('플레이리스트에 곡을 추가하는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const shouldShowTJ = showFilter === 'ALL' || showFilter === 'TJ';
  const shouldShowKY = showFilter === 'ALL' || showFilter === 'KY';

  // 곡 정보 텍스트
  const mainTitle = item.title_jp || item.title_en;
  const subTitle = item.artist;

  const shouldShowMainTitleMarquee =
    mainTitleWidth > songInfoWidth && songInfoWidth > 0;
  const shouldShowSubTitleMarquee =
    subTitleWidth > songInfoWidth && songInfoWidth > 0;

  // 플레이리스트 목록 아이템 렌더링
  const renderPlaylistItem = ({ item: playlist }: { item: Playlist }) => {
    return (
      <TouchableOpacity
        style={[
          styles.playlistItem,
          selectedPlaylistId === playlist.playlistId &&
            styles.selectedPlaylistItem,
        ]}
        onPress={() => setSelectedPlaylistId(playlist.playlistId)}
      >
        <View style={styles.playlistInfo}>
          <Ionicons
            name="musical-notes"
            size={20}
            color="#7ed6f7"
            style={styles.playlistIcon}
          />
          <View style={styles.playlistTextContainer}>
            <Text style={styles.playlistTitle}>{playlist.title}</Text>
            {playlist.description && (
              <Text style={styles.playlistDescription}>
                {playlist.description}
              </Text>
            )}
            <Text style={styles.playlistSongCount}>{playlist.songCount}곡</Text>
          </View>
        </View>
        {selectedPlaylistId === playlist.playlistId && (
          <Ionicons name="checkmark-circle" size={20} color="#7ed6f7" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.resultItem}>
      {/* 번호 박스 */}
      <View style={styles.numberColumn}>
        {shouldShowTJ && item.tj_number ? (
          <View style={styles.tjBox}>
            <Text style={styles.songTitle}>{item.tj_number}</Text>
          </View>
        ) : null}
        {shouldShowKY && item.ky_number ? (
          <View style={styles.kyBox}>
            <Text style={styles.songTitle}>{item.ky_number}</Text>
          </View>
        ) : null}
      </View>

      {/* 곡 정보 */}
      <View
        style={styles.songInfo}
        onLayout={event => {
          setSongInfoWidth(event.nativeEvent.layout.width);
        }}
      >
        {shouldShowMainTitleMarquee ? (
          <Marquee speed={0.3} spacing={150} style={styles.marqueeStyle}>
            <Text style={styles.songTitle}>{mainTitle}</Text>
          </Marquee>
        ) : (
          <Text
            style={styles.songTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
            onTextLayout={event => {
              const textWidth = event.nativeEvent.lines[0]?.width || 0;
              setMainTitleWidth(textWidth);
            }}
          >
            {mainTitle}
          </Text>
        )}
        {shouldShowSubTitleMarquee ? (
          <Marquee speed={0.3} spacing={150} style={styles.marqueeStyle}>
            <Text style={styles.songSub}>{subTitle}</Text>
          </Marquee>
        ) : (
          <Text
            style={styles.songSub}
            numberOfLines={1}
            ellipsizeMode="tail"
            onTextLayout={event => {
              const textWidth = event.nativeEvent.lines[0]?.width || 0;
              setSubTitleWidth(textWidth);
            }}
          >
            {subTitle}
          </Text>
        )}
      </View>

      {/* 액션 버튼들 */}
      <View style={styles.actionButtons}>
        {/* 즐겨찾기 버튼 */}
        <FavoriteButton
          isFavorite={isCurrentlyFavorite}
          onPress={handleToggleFavorite}
        />

        {/* 플레이리스트 추가 버튼 */}
        {!hidePlaylistButton && (
          <TouchableOpacity
            style={styles.playlistAddButton}
            onPress={openPlaylistModal}
            disabled={loading}
          >
            <Ionicons name="folder-outline" size={22} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* 플레이리스트 선택 모달 */}
      <Modal
        visible={showPlaylistModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closePlaylistModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>플레이리스트에 추가</Text>
              <TouchableOpacity
                onPress={closePlaylistModal}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#aaa" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {loading ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    플레이리스트를 불러오는 중...
                  </Text>
                </View>
              ) : playlists.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    사용 가능한 플레이리스트가 없습니다.
                  </Text>
                  <Text style={styles.emptySubText}>
                    먼저 플레이리스트를 생성해주세요.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={playlists}
                  keyExtractor={playlist => playlist.playlistId.toString()}
                  renderItem={renderPlaylistItem}
                  style={styles.playlistList}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closePlaylistModal}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  (!selectedPlaylistId || loading) && styles.disabledButton,
                ]}
                onPress={handleAddToPlaylist}
                disabled={!selectedPlaylistId || loading}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    (!selectedPlaylistId || loading) &&
                      styles.disabledButtonText,
                  ]}
                >
                  {loading ? '추가 중...' : '추가'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SongListItem;
