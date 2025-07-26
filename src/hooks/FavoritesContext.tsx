import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Song } from '../api/song';
import { fetchMyLikes, toggleLike } from '../api/song';
import { useToast } from '../contexts/ToastContext';
import {
  getFavorites,
  saveFavorites,
  addFavoriteToStorage,
  removeFavoriteFromStorage,
} from '../utils/favoritesStorage';

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
  const [loading, setLoading] = useState(false); // 로딩을 false로 시작 (로컬 데이터 우선)
  const { showToast } = useToast();

  // 로컬 스토리지에서 즐겨찾기 목록 로드
  const loadFavoritesFromStorage = useCallback(async () => {
    try {
      const storedFavorites = await getFavorites();
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Failed to load favorites from storage:', error);
    }
  }, []);

  // 백엔드와 동기화
  const syncWithBackend = useCallback(async () => {
    try {
      setLoading(true);
      const likedSongs = await fetchMyLikes();
      console.log('Synced favorites from backend:', likedSongs);
      await saveFavorites(likedSongs);
      setFavorites(likedSongs);
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      showToast('백엔드와 동기화에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // 앱 시작 시 로컬 데이터 로드 후 백엔드와 동기화
  useEffect(() => {
    const initializeFavorites = async () => {
      // 1. 먼저 로컬 데이터 로드 (즉시 표시)
      await loadFavoritesFromStorage();
      // 2. 백엔드와 동기화 (백그라운드에서)
      await syncWithBackend();
    };

    initializeFavorites();
  }, [loadFavoritesFromStorage, syncWithBackend]);

  const addFavorite = useCallback(
    (song: Song) => {
      const startTime = Date.now();
      console.log('🚀 [성능] 즐겨찾기 추가 시작');

      try {
        // 1. 즉시 UI 상태 업데이트 (가장 빠른 반응 - 0ms)
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

        // 2. 백그라운드에서 로컬 스토리지 저장
        const localStartTime = Date.now();
        addFavoriteToStorage(song)
          .then(updatedFavorites => {
            console.log(
              `💾 [성능] 로컬 저장 완료: ${Date.now() - localStartTime}ms`,
            );
            // 로컬 스토리지 결과로 상태 재동기화 (안전장치)
            setFavorites(updatedFavorites);
          })
          .catch(error => {
            console.error('Failed to save to local storage:', error);
          });

        // 3. 백그라운드에서 백엔드에 동기화
        const apiStartTime = Date.now();
        toggleLike(song.songId)
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
            // 백엔드 동기화 실패 시 롤백
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
        // 삭제할 노래 정보를 미리 저장 (롤백용)
        const originalSong = favorites.find(f => f.songId === songId);

        // 1. 즉시 UI 상태에서 제거 (가장 빠른 반응 - 0ms)
        setFavorites(prev => {
          const updatedFavorites = prev.filter(fav => fav.songId !== songId);
          console.log(
            `⚡ [성능] UI 즉시 업데이트 완료: ${Date.now() - startTime}ms`,
          );
          return updatedFavorites;
        });

        // 2. 백그라운드에서 로컬 스토리지에서 제거
        const localStartTime = Date.now();
        removeFavoriteFromStorage(songId)
          .then(updatedFavorites => {
            console.log(
              `💾 [성능] 로컬 저장 완료: ${Date.now() - localStartTime}ms`,
            );
            // 로컬 스토리지 결과로 상태 재동기화 (안전장치)
            setFavorites(updatedFavorites);
          })
          .catch(error => {
            console.error('Failed to remove from local storage:', error);
          });

        // 3. 백그라운드에서 백엔드에 동기화
        const apiStartTime = Date.now();
        toggleLike(songId)
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
            // 백엔드 동기화 실패 시 로컬에 다시 추가 (롤백)
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

  // 기존 loadFavorites를 refetchFavorites로 유지 (호환성)
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
