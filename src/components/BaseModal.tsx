import React from 'react';
import { Modal, TouchableOpacity, ViewStyle, ModalProps } from 'react-native';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  overlayStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  enableOutsideTouch?: boolean;
  modalProps?: Partial<ModalProps>;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  overlayStyle,
  containerStyle,
  enableOutsideTouch = true,
  modalProps,
}) => {
  const handleOverlayPress = () => {
    if (enableOutsideTouch) {
      onClose();
    }
  };

  const handleContainerPress = () => {
    // 컨테이너 내부 터치 시 이벤트 전파 방지
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
      {...modalProps}
    >
      <TouchableOpacity
        style={overlayStyle}
        onPress={handleOverlayPress}
        activeOpacity={1}
      >
        <TouchableOpacity
          style={containerStyle}
          onPress={handleContainerPress}
          activeOpacity={1}
        >
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default BaseModal;
