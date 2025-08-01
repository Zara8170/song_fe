import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '../hooks/FavoritesContext';
import SongListItem from '../components/SongListItem';
import styles from './LibraryScreen.styles';
import { Song } from '../api/song';
import { useToast } from '../contexts/ToastContext';
import {
  Playlist,
  getMyPlaylists,
  getOrCreateLikedSongsPlaylist,
  getPlaylistSongs,
  createPlaylist,
  deletePlaylist,
  PlaylistCreateDTO,
} from '../api/playlist';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface LibraryScreenProps {
  navigation?: any;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({
  navigation: _navigation,
}) => {
  const { favorites, syncWithBackend } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [_loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [newPlaylistIsPublic, setNewPlaylistIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedPlaylistForAction, setSelectedPlaylistForAction] =
    useState<Playlist | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const loadPlaylistSongs = useCallback(
    async (playlistId: number, playlistTitle?: string) => {
      try {
        const isLikedSongsPlaylist =
          playlistTitle === '좋아요 표시한 음악' ||
          selectedPlaylist?.title === '좋아요 표시한 음악';

        if (isLikedSongsPlaylist) {
          setPlaylistSongs(favorites);
        } else {
          const songs = await getPlaylistSongs(playlistId);
          setPlaylistSongs(songs.map(ps => ps.song));
        }
      } catch (error) {
        console.error('Failed to load playlist songs:', error);
        showToast('플레이리스트 곡 목록을 불러오는 데 실패했습니다.');
      }
    },
    [favorites, selectedPlaylist, showToast],
  );

  const loadPlaylists = useCallback(async () => {
    try {
      setLoading(true);

      try {
        await getOrCreateLikedSongsPlaylist();
      } catch (likedPlaylistError) {
        console.error(
          'Failed to create/get liked songs playlist:',
          likedPlaylistError,
        );
      }

      const allPlaylists = await getMyPlaylists();
      setPlaylists(allPlaylists);
    } catch (error) {
      console.error('Failed to load playlists:', error);
      showToast('플레이리스트 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const selectPlaylist = useCallback(
    async (playlist: Playlist) => {
      setSelectedPlaylist(playlist);
      await loadPlaylistSongs(playlist.playlistId, playlist.title);
    },
    [loadPlaylistSongs],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await syncWithBackend();
      await loadPlaylists();

      if (selectedPlaylist) {
        await loadPlaylistSongs(
          selectedPlaylist.playlistId,
          selectedPlaylist.title,
        );
      }
    } catch (error) {
      showToast('새로고침에 실패했습니다.');
    } finally {
      setRefreshing(false);
    }
  }, [
    syncWithBackend,
    loadPlaylists,
    selectedPlaylist,
    loadPlaylistSongs,
    showToast,
  ]);

  const goBackToPlaylists = () => {
    setSelectedPlaylist(null);
    setPlaylistSongs([]);
  };

  const openCreateModal = () => {
    setNewPlaylistTitle('');
    setNewPlaylistDescription('');
    setNewPlaylistIsPublic(false);
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewPlaylistTitle('');
    setNewPlaylistDescription('');
    setNewPlaylistIsPublic(false);
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) {
      Alert.alert('오류', '플레이리스트 제목을 입력해주세요.');
      return;
    }

    if (newPlaylistTitle.trim() === '좋아요 표시한 음악') {
      Alert.alert('오류', '이미 사용 중인 플레이리스트 이름입니다.');
      return;
    }

    try {
      setCreating(true);
      const playlistData: PlaylistCreateDTO = {
        title: newPlaylistTitle.trim(),
        description: newPlaylistDescription.trim() || undefined,
        isPublic: newPlaylistIsPublic,
      };

      await createPlaylist(playlistData);
      showToast('플레이리스트가 생성되었습니다.');

      await loadPlaylists();

      closeCreateModal();
    } catch (error) {
      console.error('Failed to create playlist:', error);
      showToast('플레이리스트 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  // 액션시트 열기
  const openActionSheet = (playlist: Playlist, event: any) => {
    event.stopPropagation(); // 플레이리스트 선택 이벤트 방지
    setSelectedPlaylistForAction(playlist);
    setShowActionSheet(true);
  };

  // 액션시트 닫기
  const closeActionSheet = () => {
    setShowActionSheet(false);
    setSelectedPlaylistForAction(null);
  };

  // 플레이리스트 삭제
  const handleDeletePlaylist = async () => {
    if (!selectedPlaylistForAction) return;

    Alert.alert(
      '플레이리스트 삭제',
      `"${selectedPlaylistForAction.title}"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await deletePlaylist(selectedPlaylistForAction.playlistId);
              showToast('플레이리스트가 삭제되었습니다.');

              // 삭제된 플레이리스트가 현재 선택된 플레이리스트라면 목록으로 돌아가기
              if (
                selectedPlaylist?.playlistId ===
                selectedPlaylistForAction.playlistId
              ) {
                setSelectedPlaylist(null);
                setPlaylistSongs([]);
              }

              // 목록 새로고침
              await loadPlaylists();
              closeActionSheet();
            } catch (error) {
              console.error('Failed to delete playlist:', error);
              showToast('플레이리스트 삭제에 실패했습니다.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    loadPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedPlaylist(null);
      setPlaylistSongs([]);
    }, []),
  );

  useEffect(() => {
    if (selectedPlaylist?.title === '좋아요 표시한 음악') {
      setPlaylistSongs(favorites);
    }
  }, [favorites, selectedPlaylist]);

  const renderPlaylistItem = ({ item }: { item: Playlist }) => {
    const isLikedPlaylist = item.title === '좋아요 표시한 음악';

    return (
      <TouchableOpacity
        style={styles.playlistItem}
        onPress={() => selectPlaylist(item)}
      >
        <View style={styles.playlistInfo}>
          <Ionicons
            name={isLikedPlaylist ? 'heart' : 'musical-notes'}
            size={24}
            color="#7ed6f7"
            style={styles.playlistIcon}
          />
          <View style={styles.playlistTextContainer}>
            <Text style={styles.playlistTitle}>{item.title}</Text>
            {item.description && !isLikedPlaylist && (
              <Text style={styles.playlistDescription}>{item.description}</Text>
            )}
            <Text style={styles.playlistSongCount}>
              {isLikedPlaylist ? favorites.length : item.songCount}곡
            </Text>
          </View>
        </View>

        <View style={styles.playlistActions}>
          {!isLikedPlaylist && (
            <TouchableOpacity
              style={styles.playlistMenuButton}
              onPress={event => openActionSheet(item, event)}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSongItem = ({ item }: { item: Song }) => (
    <SongListItem
      item={item}
      hidePlaylistButton={selectedPlaylist?.title === '좋아요 표시한 음악'}
    />
  );

  if (!selectedPlaylist) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>내 보관함</Text>
        </View>
        <FlatList
          data={playlists}
          keyExtractor={item => item.playlistId.toString()}
          renderItem={renderPlaylistItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>플레이리스트가 없습니다.</Text>
              <Text style={styles.emptySubText}>
                새로고침을 하거나 잠시 후 다시 시도해보세요.
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={async () => {
                  try {
                    await getOrCreateLikedSongsPlaylist();
                    await loadPlaylists();
                    showToast(
                      '좋아요 표시한 음악 플레이리스트를 생성했습니다.',
                    );
                  } catch (error) {
                    console.error('Failed to create liked playlist:', error);
                    showToast('플레이리스트 생성에 실패했습니다.');
                  }
                }}
              >
                <Text style={styles.createButtonText}>
                  좋아요 표시한 음악 플레이리스트 생성
                </Text>
              </TouchableOpacity>
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

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
          <Ionicons name="add" size={28} color="#23292e" />
        </TouchableOpacity>

        {/* 플레이리스트 생성 모달 */}
        <Modal
          visible={showCreateModal}
          transparent={true}
          animationType="slide"
          onRequestClose={closeCreateModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>새 플레이리스트</Text>
                <TouchableOpacity
                  onPress={closeCreateModal}
                  style={styles.modalCloseButton}
                >
                  <Ionicons name="close" size={24} color="#aaa" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>제목 *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newPlaylistTitle}
                    onChangeText={setNewPlaylistTitle}
                    placeholder="플레이리스트 제목을 입력하세요"
                    placeholderTextColor="#666"
                    maxLength={50}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>설명</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    value={newPlaylistDescription}
                    onChangeText={setNewPlaylistDescription}
                    placeholder="플레이리스트 설명을 입력하세요 (선택사항)"
                    placeholderTextColor="#666"
                    multiline={true}
                    numberOfLines={3}
                    maxLength={200}
                  />
                </View>

                <View style={styles.switchGroup}>
                  <Text style={styles.inputLabel}>공개 설정</Text>
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>
                      {newPlaylistIsPublic ? '공개' : '비공개'}
                    </Text>
                    <Switch
                      value={newPlaylistIsPublic}
                      onValueChange={setNewPlaylistIsPublic}
                      trackColor={{ false: '#3a4147', true: '#7ed6f7' }}
                      thumbColor={newPlaylistIsPublic ? '#fff' : '#aaa'}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeCreateModal}
                  disabled={creating}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleCreatePlaylist}
                  disabled={creating || !newPlaylistTitle.trim()}
                >
                  <Text style={styles.confirmButtonText}>
                    {creating ? '생성 중...' : '생성'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 플레이리스트 액션시트 */}
        <Modal
          visible={showActionSheet}
          transparent={true}
          animationType="slide"
          onRequestClose={closeActionSheet}
        >
          <View style={styles.actionSheetOverlay}>
            <TouchableOpacity
              style={styles.actionSheetBackdrop}
              onPress={closeActionSheet}
              activeOpacity={1}
            />
            <View style={styles.actionSheetContainer}>
              <View style={styles.actionSheetHeader}>
                <View style={styles.actionSheetTitleContainer}>
                  <Ionicons
                    name="musical-notes"
                    size={20}
                    color="#7ed6f7"
                    style={styles.actionSheetTitleIcon}
                  />
                  <Text style={styles.actionSheetTitle}>
                    {selectedPlaylistForAction?.title}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.actionSheetButton}
                onPress={handleDeletePlaylist}
                disabled={deleting}
              >
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
                <Text style={styles.actionSheetDeleteText}>
                  {deleting ? '삭제 중...' : '플레이리스트 삭제'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionSheetButton,
                  styles.actionSheetCancelButton,
                ]}
                onPress={closeActionSheet}
              >
                <Text style={styles.actionSheetCancelText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // 플레이리스트 상세 화면
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBackToPlaylists}>
          <Ionicons name="chevron-back" size={24} color="#7ed6f7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedPlaylist.title}</Text>
      </View>
      <FlatList
        data={playlistSongs}
        keyExtractor={item => item.songId.toString()}
        renderItem={renderSongItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedPlaylist.title === '좋아요 표시한 음악'
                ? '좋아요한 노래가 없습니다.'
                : '플레이리스트에 노래가 없습니다.'}
            </Text>
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

export default LibraryScreen;
