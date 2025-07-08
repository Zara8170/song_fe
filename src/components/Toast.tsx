import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import styles from './Toast.styles';

type ToastProps = {
  visible: boolean;
  message: string;
  onHide: () => void;
};

const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(onHide);
        }, 1200);
      });
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visible, onHide, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;
