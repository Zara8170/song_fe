import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Song } from '../api/song';
import { fetchMyLikes, toggleLike, requestRecommendation } from '../api/song';
import { useToast } from '../contexts/ToastContext';
import {
  getFavorites,
  saveFavorites,
  addFavoriteToStorage,
  removeFavoriteFromStorage,
} from '../utils/favoritesStorage';
import {
  getOrCreateLikedSongsPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from '../api/playlist';

interface FavoritesContextType {
  favorites: Song[];
  addFavorite: (song: Song) => void;
  removeFavorite: (songId: number) => void;
  isFavorite: (songId: number) => boolean;
  loading: boolean;
  refetchFavorites: () => Promise<void>;
  syncWithBackend: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const loadFavoritesFromStorage = useCallback(async () => {
    try {
      const storedFavorites = await getFavorites();
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Failed to load favorites from storage:', error);
    }
  }, []);

  const requestBackgroundRecommendation = useCallback(
    async (favoriteList: Song[]) => {
      try {
        const favoriteIds = favoriteList
          .map(song => song.songId)
          .filter(id => !Number.isNaN(id));

        if (favoriteIds.length === 0) {
          console.log('No favorite songs to request recommendation');
          return;
        }

        console.log(
          'Requesting background recommendation for',
          favoriteIds.length,
          'favorites',
        );
        await requestRecommendation(favoriteIds);
        console.log('Background recommendation request sent successfully');
      } catch (error) {
        console.error('Failed to request background recommendation:', error);
      }
    },
    [],
  );

  const syncWithBackend = useCallback(async () => {
    try {
      setLoading(true);
      const likedSongs = await fetchMyLikes();
      console.log('Synced favorites from backend:', likedSongs);
      await saveFavorites(likedSongs);
      setFavorites(likedSongs);

      if (likedSongs.length > 0) {
        requestBackgroundRecommendation(likedSongs);
      }
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      showToast('백엔드와 동기화에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [showToast, requestBackgroundRecommendation]);

  useEffect(() => {
    const initializeFavorites = async () => {
      await loadFavoritesFromStorage();
      await syncWithBackend();
    };

    initializeFavorites();
  }, [loadFavoritesFromStorage, syncWithBackend]);

  const addFavorite = useCallback(
    (song: Song) => {
      const startTime = Date.now();
      console.log('🚀 [성능] 즐겨찾기 추가 시작');

      try {
        setFavorites(prev => {
          const isAlreadyFavorite = prev.some(
            fav => fav.songId === song.songId,
          );
          if (!isAlreadyFavorite) {
            const updated = [...prev, song];
            console.log(
              `⚡ [성능] UI 즉시 업데이트 완료: ${Date.now() - startTime}ms`,
            );
            return updated;
          }
          return prev;
        });

        const localStartTime = Date.now();
        addFavoriteToStorage(song)
          .then(updatedFavorites => {
            console.log(
              `💾 [성능] 로컬 저장 완료: ${Date.now() - localStartTime}ms`,
            );
            setFavorites(updatedFavorites);
          })
          .catch(error => {
            console.error('Failed to save to local storage:', error);
          });

        const apiStartTime = Date.now();
        Promise.all([
          toggleLike(song.songId),
          (async () => {
            try {
              const likedSongsPlaylist = await getOrCreateLikedSongsPlaylist();
              await addSongToPlaylist(likedSongsPlaylist.playlistId, {
                songId: song.songId,
              });
            } catch (error: any) {
              console.error('Failed to add song to liked playlist:', error);

              if (error?.responseData) {
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
                  return;
                }
              } else if (error?.response) {
                try {
                  const errorData = await error.response.json();
                  if (
                    (errorData?.message &&
                      errorData.message.includes(
                        '이미 플레이리스트에 추가된 곡입니다',
                      )) ||
                    (errorData?.errMsg &&
                      errorData.errMsg.includes(
                        '이미 플레이리스트에 추가된 곡입니다',
                      ))
                  ) {
                    return;
                  }
                } catch (parseError) {
                }
              } else if (
                error?.message &&
                error.message.includes('이미 플레이리스트에 추가된 곡입니다')
              ) {
                return;
              }

            }
          })(),
        ])
          .then(() => {
            console.log(
              `🌐 [성능] 백엔드 API 완료: ${Date.now() - apiStartTime}ms`,
            );
            console.log(
              `🎯 [성능] 전체 프로세스 완료: ${Date.now() - startTime}ms`,
            );
          })
          .catch(error => {
            console.error('Failed to sync add favorite with backend:', error);
            console.log(
              `❌ [성능] 백엔드 API 실패: ${Date.now() - apiStartTime}ms`,
            );
            removeFavoriteFromStorage(song.songId).then(revertedFavorites => {
              setFavorites(revertedFavorites);
              showToast('즐겨찾기 추가에 실패했습니다.');
            });
          });
      } catch (error) {
        console.error('Failed to add favorite:', error);
        showToast('즐겨찾기 추가에 실패했습니다.');
      }
    },
    [showToast],
  );

  const removeFavorite = useCallback(
    (songId: number) => {
      const startTime = Date.now();
      console.log('🚀 [성능] 즐겨찾기 삭제 시작');

      try {
        const originalSong = favorites.find(f => f.songId === songId);

        setFavorites(prev => {
          const updatedFavorites = prev.filter(fav => fav.songId !== songId);
          console.log(
            `⚡ [성능] UI 즉시 업데이트 완료: ${Date.now() - startTime}ms`,
          );
          return updatedFavorites;
        });

        const localStartTime = Date.now();
        removeFavoriteFromStorage(songId)
          .then(updatedFavorites => {
            console.log(
              `💾 [성능] 로컬 저장 완료: ${Date.now() - localStartTime}ms`,
            );
            setFavorites(updatedFavorites);
          })
          .catch(error => {
            console.error('Failed to remove from local storage:', error);
          });

        const apiStartTime = Date.now();
        Promise.all([
          toggleLike(songId),
          (async () => {
            try {
              const likedSongsPlaylist = await getOrCreateLikedSongsPlaylist();
              await removeSongFromPlaylist(
                likedSongsPlaylist.playlistId,
                songId,
              );
            } catch (error) {
              console.error(
                'Failed to remove song from liked playlist:',
                error,
              );
            }
          })(),
        ])
          .then(() => {
            console.log(
              `🌐 [성능] 백엔드 API 완료: ${Date.now() - apiStartTime}ms`,
            );
            console.log(
              `🎯 [성능] 전체 프로세스 완료: ${Date.now() - startTime}ms`,
            );
          })
          .catch(error => {
            console.error(
              'Failed to sync remove favorite with backend:',
              error,
            );
            console.log(
              `❌ [성능] 백엔드 API 실패: ${Date.now() - apiStartTime}ms`,
            );
            if (originalSong) {
              addFavoriteToStorage(originalSong).then(revertedFavorites => {
                setFavorites(revertedFavorites);
                showToast('즐겨찾기 삭제에 실패했습니다.');
              });
            }
          });
      } catch (error) {
        console.error('Failed to remove favorite:', error);
        showToast('즐겨찾기 삭제에 실패했습니다.');
      }
    },
    [showToast, favorites],
  );

  const isFavorite = useCallback(
    (songId: number) => {
      return favorites.some(favorite => favorite.songId === songId);
    },
    [favorites],
  );

  const refetchFavorites = useCallback(async () => {
    await syncWithBackend();
  }, [syncWithBackend]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
        refetchFavorites,
        syncWithBackend,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
