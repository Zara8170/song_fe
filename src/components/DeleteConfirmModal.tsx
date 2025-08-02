import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../screens/LibraryScreen.styles';
import BaseModal from './BaseModal';

interface DeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '삭제',
  cancelText = '취소',
  loading = false,
}) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      animationType="fade"
      overlayStyle={styles.removeConfirmOverlay}
      containerStyle={styles.removeConfirmContainer}
    >
      <Text style={styles.removeConfirmTitle}>{title}</Text>
      <Text style={styles.removeConfirmMessage}>{message}</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7ed6f7" />
          <Text style={styles.loadingText}>삭제 중...</Text>
        </View>
      ) : (
        <View style={styles.removeConfirmButtons}>
          <TouchableOpacity
            style={[
              styles.removeConfirmButton,
              styles.removeConfirmCancelButton,
            ]}
            onPress={onClose}
          >
            <Text style={styles.removeConfirmCancelText}>{cancelText}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.removeConfirmButton,
              styles.removeConfirmDeleteButton,
            ]}
            onPress={onConfirm}
          >
            <Text style={styles.removeConfirmDeleteText}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </BaseModal>
  );
};

export default DeleteConfirmModal;
