import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../screens/LibraryScreen.styles';

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName?: string;
  iconSize?: number;
  iconColor?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  iconName = 'add',
  iconSize = 28,
  iconColor = '#23292e',
}) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Ionicons name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
