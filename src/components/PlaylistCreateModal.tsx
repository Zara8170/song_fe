import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../screens/LibraryScreen.styles';
import BaseModal from './BaseModal';

interface PlaylistCreateModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  onTitleChange: (text: string) => void;
  description: string;
  onDescriptionChange: (text: string) => void;
  isPublic: boolean;
  onPublicChange: (value: boolean) => void;
  creating: boolean;
}

const PlaylistCreateModal: React.FC<PlaylistCreateModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  isPublic,
  onPublicChange,
  creating,
}) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      animationType="slide"
      overlayStyle={styles.modalOverlay}
      containerStyle={styles.modalContainer}
    >
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>새 플레이리스트</Text>
        <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
          <Ionicons name="close" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      <View style={styles.modalContent}>
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
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={onDescriptionChange}
            placeholder="플레이리스트 설명을 입력하세요 (선택사항)"
            placeholderTextColor="#666"
            multiline={true}
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        <View style={styles.switchGroup}>
          <Text style={styles.inputLabel}>공개 설정</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {isPublic ? '공개' : '비공개'}
            </Text>
            <Switch
              value={isPublic}
              onValueChange={onPublicChange}
              trackColor={{ false: '#3a4147', true: '#7ed6f7' }}
              thumbColor={isPublic ? '#fff' : '#aaa'}
            />
          </View>
        </View>
      </View>

      <View style={styles.modalFooter}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={onClose}
          disabled={creating}
        >
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.confirmButton]}
          onPress={onConfirm}
          disabled={creating || !title.trim()}
        >
          <Text style={styles.confirmButtonText}>
            {creating ? '생성 중...' : '생성'}
          </Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
};

export default PlaylistCreateModal;
