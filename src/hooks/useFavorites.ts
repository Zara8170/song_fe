import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'FAVORITE_SONGS';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (data) setFavorites(JSON.parse(data));
    else setFavorites([]);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const addFavorite = async (id: string) => {
    if (favorites.includes(id)) return;
    const newFavorites = [...favorites, id];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    loadFavorites();
  };

  const removeFavorite = async (id: string) => {
    const newFavorites = favorites.filter(favId => favId !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    loadFavorites();
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
