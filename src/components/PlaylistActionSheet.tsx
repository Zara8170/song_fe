import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../screens/LibraryScreen.styles';
import { Playlist } from '../api/playlist';
import BaseModal from './BaseModal';

interface PlaylistActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  playlist: Playlist | null;
  deleting: boolean;
}

const PlaylistActionSheet: React.FC<PlaylistActionSheetProps> = ({
  visible,
  onClose,
  onDelete,
  playlist,
  deleting,
}) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      animationType="slide"
      overlayStyle={styles.actionSheetOverlay}
      containerStyle={styles.actionSheetContainer}
    >
      <View style={styles.actionSheetHeader}>
        <View style={styles.actionSheetTitleContainer}>
          <Ionicons
            name="musical-notes"
            size={20}
            color="#7ed6f7"
            style={styles.actionSheetTitleIcon}
          />
          <Text style={styles.actionSheetTitle}>{playlist?.title}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.actionSheetButton}
        onPress={onDelete}
        disabled={deleting}
      >
        <Ionicons name="trash-outline" size={20} color="#ff4444" />
        <Text style={styles.actionSheetDeleteText}>
          {deleting ? '삭제 중...' : '플레이리스트 삭제'}
        </Text>
      </TouchableOpacity>
    </BaseModal>
  );
};

export default PlaylistActionSheet;
