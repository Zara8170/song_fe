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

interface FavoritesContextType {
  favorites: Song[];
  addFavorite: (song: Song) => void;
  removeFavorite: (songId: number) => void;
  isFavorite: (songId: number) => boolean;
  loading: boolean;
  refetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const likedSongs = await fetchMyLikes();
      console.log(likedSongs);
      setFavorites(likedSongs);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      showToast('즐겨찾기 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(
    async (song: Song) => {
      try {
        await toggleLike(song.songId);
        setFavorites(prev => [...prev, song]);
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
        await toggleLike(songId);
        setFavorites(prev => prev.filter(s => s.songId !== songId));
      } catch (error) {
        console.error('Failed to remove favorite:', error);
        showToast('즐겨찾기 삭제에 실패했습니다.');
      }
    },
    [showToast],
  );

  const isFavorite = useCallback(
    (songId: number) => {
      return favorites.some(favorite => favorite.songId === songId);
    },
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
        refetchFavorites: loadFavorites,
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
