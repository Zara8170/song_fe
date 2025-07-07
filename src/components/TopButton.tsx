import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, Text, Animated } from 'react-native';
import { topButtonStyles } from './TopButton.styles';

interface TopButtonProps {
  visible: boolean;
  onPress: () => void;
}

const TopButton: React.FC<TopButtonProps> = ({ visible, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 40,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => setShouldRender(false));
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!shouldRender) return null;

  return (
    <Animated.View
      style={[
        topButtonStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={topButtonStyles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={topButtonStyles.arrow}>▲</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TopButton;
