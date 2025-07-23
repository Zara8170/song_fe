import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMyLikes, toggleLike } from '../api/song';

const FAVORITES_KEY = 'FAVORITE_SONGS';

type FavoritesContextType = {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const ids = await fetchMyLikes();
        setFavorites(ids.map(String));
        await AsyncStorage.setItem(
          FAVORITES_KEY,
          JSON.stringify(ids.map(String)),
        );
      } catch {
        const cached = await AsyncStorage.getItem(FAVORITES_KEY);
        if (cached) setFavorites(JSON.parse(cached));
      }
    })();
  }, []);

  const saveFavorites = async (next: string[]) => {
    setFavorites(next);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  };

  const addFavorite = (id: string) => {
    if (favorites.includes(id)) return;
    toggleLike(Number(id))
      .then(({ liked }) => {
        if (liked) saveFavorites([...favorites, id]);
      })
      .catch(console.error);
  };

  const removeFavorite = (id: string) => {
    if (!favorites.includes(id)) return;
    toggleLike(Number(id))
      .then(({ liked }) => {
        if (!liked) saveFavorites(favorites.filter(f => f !== id));
      })
      .catch(console.error);
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
