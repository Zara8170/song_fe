import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  BackHandler,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFavorites } from '../hooks/FavoritesContext';
import SongListItem from '../components/SongListItem';
import PlaylistCreateModal from '../components/PlaylistCreateModal';
import PlaylistActionSheet from '../components/PlaylistActionSheet';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import PlaylistItem from '../components/PlaylistItem';
import FloatingActionButton from '../components/FloatingActionButton';
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
  removeSongFromPlaylist,
  PlaylistCreateDTO,
} from '../api/playlist';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface LibraryScreenProps {
  navigation: any;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ navigation }) => {
  const { favorites, syncWithBackend, removeFavorite } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null,
  );
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedPlaylistForAction, setSelectedPlaylistForAction] =
    useState<Playlist | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [removingSong, setRemovingSong] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [selectedSongForRemoval, setSelectedSongForRemoval] = useState<
    number | null
  >(null);
  const [showDeletePlaylistConfirm, setShowDeletePlaylistConfirm] =
    useState(false);
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

  const goBackToPlaylists = useCallback(() => {
    setSelectedPlaylist(null);
    setPlaylistSongs([]);
    setLoading(true);
    loadPlaylists();
  }, [loadPlaylists]);

  // 뒤로가기 버튼 처리
  const handleBackPress = useCallback(() => {
    if (selectedPlaylist) {
      goBackToPlaylists();
      return true; // 이벤트 소비 (기본 뒤로가기 동작 방지)
    }
    return false; // 기본 뒤로가기 동작 허용
  }, [selectedPlaylist, goBackToPlaylists]);

  // 네비게이션 beforeRemove 이벤트 처리
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!selectedPlaylist) {
        // 플레이리스트 목록 화면에서는 정상적으로 뒤로가기 허용
        return;
      }

      // 플레이리스트 상세 화면에서는 뒤로가기 방지하고 플레이리스트 목록으로 이동
      e.preventDefault();
      goBackToPlaylists();
    });

    return unsubscribe;
  }, [navigation, selectedPlaylist, goBackToPlaylists]);

  // 안드로이드 하드웨어 뒤로가기 버튼 처리
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        const subscription = BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackPress,
        );
        return () => subscription.remove();
      }
    }, [handleBackPress]),
  );

  const openCreateModal = () => {
    setNewPlaylistTitle('');
    setNewPlaylistDescription('');
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewPlaylistTitle('');
    setNewPlaylistDescription('');
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
        isPublic: false, // 기본값으로 비공개 설정
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

  const openActionSheet = (playlist: Playlist, event: any) => {
    event.stopPropagation();
    setSelectedPlaylistForAction(playlist);
    setShowActionSheet(true);
  };

  const closeActionSheet = () => {
    setShowActionSheet(false);
    setSelectedPlaylistForAction(null);
  };

  const handleDeletePlaylist = () => {
    if (!selectedPlaylistForAction) return;
    setShowActionSheet(false);
    setTimeout(() => {
      setShowDeletePlaylistConfirm(true);
    }, 100);
  };

  const confirmDeletePlaylist = async () => {
    if (!selectedPlaylistForAction) return;

    try {
      setDeleting(true);
      await deletePlaylist(selectedPlaylistForAction.playlistId);
      showToast('플레이리스트가 삭제되었습니다.');

      if (
        selectedPlaylist?.playlistId === selectedPlaylistForAction.playlistId
      ) {
        setSelectedPlaylist(null);
        setPlaylistSongs([]);
      }

      await loadPlaylists();
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      showToast('플레이리스트 삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
      setShowDeletePlaylistConfirm(false);
      setSelectedPlaylistForAction(null);
    }
  };

  const cancelDeletePlaylist = () => {
    if (!deleting) {
      setShowDeletePlaylistConfirm(false);
      setSelectedPlaylistForAction(null);
    }
  };

  const handleRemoveSongFromPlaylist = async (songId: number) => {
    if (!selectedPlaylist) return;
    setSelectedSongForRemoval(songId);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveSong = async () => {
    if (!selectedPlaylist || !selectedSongForRemoval) return;

    if (selectedPlaylist.title === '좋아요 표시한 음악') {
      setRemovingSong(true);
      try {
        removeFavorite(selectedSongForRemoval);
        showToast('좋아요에서 제거되었습니다.');
      } finally {
        setRemovingSong(false);
        setShowRemoveConfirm(false);
        setSelectedSongForRemoval(null);
      }
      return;
    }

    try {
      setRemovingSong(true);
      await removeSongFromPlaylist(
        selectedPlaylist.playlistId,
        selectedSongForRemoval,
      );
      showToast('플레이리스트에서 곡이 제거되었습니다.');

      // 플레이리스트 곡 목록과 플레이리스트 목록 모두 새로고침
      await Promise.all([
        loadPlaylistSongs(selectedPlaylist.playlistId, selectedPlaylist.title),
        loadPlaylists(), // songCount 업데이트를 위해 플레이리스트 목록도 새로고침
      ]);
    } catch (error) {
      console.error('Failed to remove song from playlist:', error);
      showToast('곡 제거에 실패했습니다.');
    } finally {
      setRemovingSong(false);
      setShowRemoveConfirm(false);
      setSelectedSongForRemoval(null);
    }
  };

  const cancelRemoveSong = () => {
    if (!removingSong) {
      setShowRemoveConfirm(false);
      setSelectedSongForRemoval(null);
    }
  };

  useEffect(() => {
    loadPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedPlaylist(null);
      setPlaylistSongs([]);
      // 화면에 포커스가 올 때마다 플레이리스트 목록 새로고침 (songCount 업데이트)
      loadPlaylists();
    }, [loadPlaylists]),
  );

  useEffect(() => {
    if (selectedPlaylist?.title === '좋아요 표시한 음악') {
      setPlaylistSongs(favorites);
    }
  }, [favorites, selectedPlaylist]);

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <PlaylistItem
      playlist={item}
      favoriteCount={favorites.length}
      onPress={selectPlaylist}
      onMenuPress={openActionSheet}
    />
  );

  const renderSongItem = ({ item }: { item: Song }) => (
    <SongListItem
      item={item}
      hidePlaylistButton={true}
      hideRemoveButton={selectedPlaylist?.title === '좋아요 표시한 음악'}
      onRemoveFromPlaylist={() => handleRemoveSongFromPlaylist(item.songId)}
    />
  );

  if (!selectedPlaylist) {
    if (loading) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>내 보관함</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7ed6f7" />
            <Text style={styles.loadingText}>보관함을 불러오는 중...</Text>
          </View>
        </View>
      );
    }

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
        <FloatingActionButton onPress={openCreateModal} />

        {/* 플레이리스트 생성 모달 */}
        <PlaylistCreateModal
          visible={showCreateModal}
          onClose={closeCreateModal}
          onConfirm={handleCreatePlaylist}
          title={newPlaylistTitle}
          onTitleChange={setNewPlaylistTitle}
          description={newPlaylistDescription}
          onDescriptionChange={setNewPlaylistDescription}
          creating={creating}
        />

        {/* 플레이리스트 액션시트 */}
        <PlaylistActionSheet
          visible={showActionSheet}
          onClose={closeActionSheet}
          onDelete={handleDeletePlaylist}
          playlist={selectedPlaylistForAction}
          deleting={deleting}
        />

        {/* 플레이리스트 삭제 확인 모달 */}
        <DeleteConfirmModal
          visible={showDeletePlaylistConfirm}
          onClose={cancelDeletePlaylist}
          onConfirm={confirmDeletePlaylist}
          title="플레이리스트 삭제"
          message={`"${selectedPlaylistForAction?.title}"을(를) 삭제하시겠습니다\n이 작업은 되돌릴 수 없습니다.`}
          loading={deleting}
        />
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

      {/* 곡 삭제 확인 모달 */}
      <DeleteConfirmModal
        visible={showRemoveConfirm}
        onClose={cancelRemoveSong}
        onConfirm={confirmRemoveSong}
        title="플레이리스트에서 저장 항목을 삭제할까요?"
        message="이 곡을 현재 플레이리스트에서 삭제합니다."
        loading={removingSong}
      />

      {/* 플레이리스트 삭제 확인 모달 */}
      <DeleteConfirmModal
        visible={showDeletePlaylistConfirm}
        onClose={cancelDeletePlaylist}
        onConfirm={confirmDeletePlaylist}
        title="플레이리스트 삭제"
        message={`"${selectedPlaylistForAction?.title}"을(를) 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`}
        loading={deleting}
      />
    </View>
  );
};

export default LibraryScreen;
