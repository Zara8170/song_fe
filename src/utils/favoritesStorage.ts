import EncryptedStorage from 'react-native-encrypted-storage';
import { Song } from '../api/song';

const FAVORITES_KEY = 'favorites_songs';

export const saveFavorites = async (favorites: Song[]): Promise<void> => {
  try {
    await EncryptedStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to storage:', error);
  }
};

export const getFavorites = async (): Promise<Song[]> => {
  try {
    const favoritesString = await EncryptedStorage.getItem(FAVORITES_KEY);
    if (favoritesString) {
      return JSON.parse(favoritesString);
    }
    return [];
  } catch (error) {
    console.error('Failed to get favorites from storage:', error);
    return [];
  }
};

export const addFavoriteToStorage = async (song: Song): Promise<Song[]> => {
  try {
    const currentFavorites = await getFavorites();
    const isAlreadyFavorite = currentFavorites.some(
      fav => fav.songId === song.songId,
    );

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...currentFavorites, song];
      await saveFavorites(updatedFavorites);
      return updatedFavorites;
    }
    return currentFavorites;
  } catch (error) {
    console.error('Failed to add favorite to storage:', error);
    return await getFavorites();
  }
};

export const removeFavoriteFromStorage = async (
  songId: number,
): Promise<Song[]> => {
  try {
    const currentFavorites = await getFavorites();
    const updatedFavorites = currentFavorites.filter(
      fav => fav.songId !== songId,
    );
    await saveFavorites(updatedFavorites);
    return updatedFavorites;
  } catch (error) {
    console.error('Failed to remove favorite from storage:', error);
    return await getFavorites();
  }
};

export const clearFavorites = async (): Promise<void> => {
  try {
    await EncryptedStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Failed to clear favorites from storage:', error);
  }
};
