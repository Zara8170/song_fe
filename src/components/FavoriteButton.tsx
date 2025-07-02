import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFavorites } from '../hooks/FavoritesContext';

type Props = {
  songId: string;
};

export default function FavoriteButton({ songId }: Props) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const toggleFavorite = () => {
    if (isFavorite(songId)) {
      removeFavorite(songId);
    } else {
      addFavorite(songId);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleFavorite}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon
        name="star"
        size={24}
        color={isFavorite(songId) ? 'gold' : 'gray'}
      />
    </TouchableOpacity>
  );
}
