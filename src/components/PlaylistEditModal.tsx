import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Keyboard,
  Animated,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './PlaylistEditModal.styles';

interface PlaylistEditModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  onTitleChange: (text: string) => void;
  description: string;
  onDescriptionChange: (text: string) => void;
  isPublic: boolean;
  onIsPublicChange: (value: boolean) => void;
  updating: boolean;
}

const PlaylistEditModal: React.FC<PlaylistEditModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  isPublic,
  onIsPublicChange,
  updating,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      const keyboardHeight = event.endCoordinates.height;

      const moveDistance = Math.min(keyboardHeight * 0.2, 40);

      Animated.timing(translateY, {
        toValue: -moveDistance,
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    const keyboardWillHide = () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    };

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, keyboardWillShow);
    const hideSubscription = Keyboard.addListener(hideEvent, keyboardWillHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [translateY]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backgroundTouchable}
          onPress={onClose}
          activeOpacity={1}
        />

        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY }] }]}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.title}>플레이리스트 수정</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#aaa" />
              </TouchableOpacity>
            </View>

            {/* 콘텐츠 */}
            <View style={styles.content}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>제목 *</Text>
                <TextInput
                  style={styles.textInput}
                  value={title}
                  onChangeText={onTitleChange}
                  placeholder="플레이리스트 제목을 입력하세요"
                  placeholderTextColor="#666"
                  maxLength={50}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>설명</Text>
                <TextInput
                  style={styles.textInput}
                  value={description}
                  onChangeText={onDescriptionChange}
                  placeholder="플레이리스트 설명을 입력하세요 (선택사항)"
                  placeholderTextColor="#666"
                  maxLength={100}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.switchContainer}>
                  <View style={styles.switchLabelContainer}>
                    <Text style={styles.inputLabel}>공개 설정</Text>
                    <Text style={styles.switchSubLabel}>
                      {isPublic
                        ? '다른 사용자가 볼 수 있음'
                        : '나만 볼 수 있음'}
                    </Text>
                  </View>
                  <Switch
                    value={isPublic}
                    onValueChange={onIsPublicChange}
                    trackColor={{ false: '#4a5157', true: '#7ed6f7' }}
                    thumbColor={isPublic ? '#fff' : '#ddd'}
                    ios_backgroundColor="#4a5157"
                  />
                </View>
              </View>
            </View>

            {/* 푸터 */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={onConfirm}
                disabled={updating || !title.trim()}
              >
                <Text style={styles.confirmButtonText}>
                  {updating ? '수정 중...' : '수정'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default PlaylistEditModal;
