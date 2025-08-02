import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Song } from '../api/song';
import FavoriteButton from './FavoriteButton';
import styles from './SongListItem.styles';
import { Marquee } from '@animatereactnative/marquee';
import { useFavorites } from '../hooks/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
import { Playlist, getMyPlaylists, addSongToPlaylist } from '../api/playlist';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BaseModal from './BaseModal';

interface SongListItemProps {
  item: Song;
  showFilter?: 'ALL' | 'TJ' | 'KY';
  onFavoriteAdd?: () => void;
  onFavoriteRemove?: () => void;
  hidePlaylistButton?: boolean;
  onRemoveFromPlaylist?: () => void;
  hideRemoveButton?: boolean;
}

const SongListItem: React.FC<SongListItemProps> = ({
  item,
  showFilter = 'ALL',
  onFavoriteAdd,
  onFavoriteRemove,
  hidePlaylistButton = false,
  onRemoveFromPlaylist,
  hideRemoveButton = false,
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { showToast } = useToast();

  const [songInfoWidth, setSongInfoWidth] = useState(0);
  const [mainTitleWidth, setMainTitleWidth] = useState(0);
  const [subTitleWidth, setSubTitleWidth] = useState(0);

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );
  const [listLoading, setListLoading] = useState(false);

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

  const openPlaylistModal = async () => {
    try {
      setListLoading(true);
      setPlaylists([]);
      setSelectedPlaylistId(null);
      setShowPlaylistModal(true);

      const allPlaylists = await getMyPlaylists();

      const filteredPlaylists = allPlaylists.filter(
        playlist => playlist.title !== '좋아요 표시한 음악',
      );

      if (filteredPlaylists.length === 0) {
        setPlaylists([]);
      } else {
        setPlaylists(filteredPlaylists);
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
      showToast('플레이리스트 목록을 불러오는 데 실패했습니다.');
      setShowPlaylistModal(false);
    } finally {
      setListLoading(false);
    }
  };

  const closePlaylistModal = () => {
    setShowPlaylistModal(false);
    setSelectedPlaylistId(null);
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) {
      Alert.alert('알림', '플레이리스트를 선택해주세요.');
      return;
    }

    const selectedPlaylist = playlists.find(
      p => p.playlistId === selectedPlaylistId,
    );

    // 바로 모달창 닫기
    closePlaylistModal();

    // 백그라운드에서 플레이리스트에 곡 추가 처리
    try {
      await addSongToPlaylist(selectedPlaylistId, { songId: item.songId });
      showToast(`"${selectedPlaylist?.title}"에 곡이 추가되었습니다.`);
    } catch (error: any) {
      console.error('Failed to add song to playlist:', error);

      let errorMessage = '플레이리스트에 곡을 추가하는 데 실패했습니다.';

      if (error?.responseData) {
        console.log('Error response data:', error.responseData);

        let message;
        if (typeof error.responseData === 'string') {
          message = error.responseData;
        } else if (typeof error.responseData === 'object') {
          message =
            error.responseData?.message ||
            error.responseData?.error ||
            error.responseData?.detail ||
            error.responseData?.errMsg;
        }

        if (
          message &&
          message.includes('이미 플레이리스트에 추가된 곡입니다')
        ) {
          errorMessage = '이미 플레이리스트에 추가된 곡입니다.';
        } else if (message) {
          errorMessage = message;
        }
      } else if (error?.response) {
        try {
          const errorData = await error.response.json();
          console.log('Error response data (fallback):', errorData);

          const message =
            errorData?.message ||
            errorData?.error ||
            errorData?.detail ||
            errorData?.errMsg ||
            errorData;
          if (
            message &&
            typeof message === 'string' &&
            message.includes('이미 플레이리스트에 추가된 곡입니다')
          ) {
            errorMessage = '이미 플레이리스트에 추가된 곡입니다.';
          } else if (message && typeof message === 'string') {
            errorMessage = message;
          }
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          try {
            const errorText = await error.response.text();
            console.log('Error response text:', errorText);
            if (
              errorText &&
              errorText.includes('이미 플레이리스트에 추가된 곡입니다')
            ) {
              errorMessage = '이미 플레이리스트에 추가된 곡입니다.';
            } else if (errorText) {
              errorMessage = errorText;
            }
          } catch (textError) {
            console.error('Failed to read error response as text:', textError);
          }
        }
      } else if (
        error?.message &&
        error.message.includes('이미 플레이리스트에 추가된 곡입니다')
      ) {
        errorMessage = '이미 플레이리스트에 추가된 곡입니다.';
      }

      showToast(errorMessage);
    }
  };

  const shouldShowTJ = showFilter === 'ALL' || showFilter === 'TJ';
  const shouldShowKY = showFilter === 'ALL' || showFilter === 'KY';

  const mainTitle = item.title_jp || item.title_en;
  const subTitle = item.artist;

  const shouldShowMainTitleMarquee =
    mainTitleWidth > songInfoWidth && songInfoWidth > 0;
  const shouldShowSubTitleMarquee =
    subTitleWidth > songInfoWidth && songInfoWidth > 0;

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
            disabled={listLoading}
          >
            <Ionicons name="folder-outline" size={22} color="#aaa" />
          </TouchableOpacity>
        )}

        {/* 플레이리스트에서 곡 삭제 버튼 */}
        {onRemoveFromPlaylist && !hideRemoveButton && (
          <TouchableOpacity
            style={styles.playlistRemoveButton}
            onPress={onRemoveFromPlaylist}
          >
            <Ionicons name="remove-circle-outline" size={22} color="#ff4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* 플레이리스트 선택 모달 */}
      <BaseModal
        visible={showPlaylistModal}
        onClose={closePlaylistModal}
        animationType="slide"
        overlayStyle={styles.modalOverlay}
        containerStyle={styles.modalContainer}
      >
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
          {listLoading ? (
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
            disabled={listLoading}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              styles.confirmButton,
              (!selectedPlaylistId || listLoading) && styles.disabledButton,
            ]}
            onPress={handleAddToPlaylist}
            disabled={!selectedPlaylistId || listLoading}
          >
            <Text
              style={[
                styles.confirmButtonText,
                (!selectedPlaylistId || listLoading) &&
                  styles.disabledButtonText,
              ]}
            >
              추가
            </Text>
          </TouchableOpacity>
        </View>
      </BaseModal>
    </View>
  );
};

export default SongListItem;
