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
    async (song: Song) => {
      try {
        // 1. 즉시 로컬에 추가
        const updatedFavorites = await addFavoriteToStorage(song);
        setFavorites(updatedFavorites);

        // 2. 백그라운드에서 백엔드에 동기화
        toggleLike(song.songId).catch(error => {
          console.error('Failed to sync add favorite with backend:', error);
          // 백엔드 동기화 실패 시 로컬에서도 제거
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
    async (songId: number) => {
      try {
        // 1. 즉시 로컬에서 제거
        const updatedFavorites = await removeFavoriteFromStorage(songId);
        setFavorites(updatedFavorites);

        // 2. 백그라운드에서 백엔드에 동기화
        toggleLike(songId).catch(async error => {
          console.error('Failed to sync remove favorite with backend:', error);
          // 백엔드 동기화 실패 시 로컬에 다시 추가
          const originalSong = favorites.find(f => f.songId === songId);
          if (originalSong) {
            const revertedFavorites = await addFavoriteToStorage(originalSong);
            setFavorites(revertedFavorites);
            showToast('즐겨찾기 삭제에 실패했습니다.');
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
