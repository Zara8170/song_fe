import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 10 }}>
      <Icon
        name={isFavorite ? 'star' : 'star-o'}
        size={24}
        color={isFavorite ? '#FFD700' : '#E0E0E0'}
      />
    </TouchableOpacity>
  );
};

export default FavoriteButton;
