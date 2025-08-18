import React from 'react';
import {
  Modal,
  TouchableOpacity,
  ViewStyle,
  ModalProps,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  overlayStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  enableOutsideTouch?: boolean;
  modalProps?: Partial<ModalProps>;
  disableScrollView?: boolean;
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
  disableScrollView = false,
}) => {
  const handleOverlayPress = () => {
    if (enableOutsideTouch) {
      onClose();
    }
  };

  const handleContainerPress = () => {
    // 컨테이너 내부 터치 시 이벤트 전파 방지
  };

  const modalContent = (
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
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
      {...modalProps}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : -80}
      >
        {disableScrollView ? (
          modalContent
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {modalContent}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BaseModal;
