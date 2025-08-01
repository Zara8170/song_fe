import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4147',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4147',
  },
  playlistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playlistIcon: {
    marginRight: 12,
  },
  playlistTextContainer: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  playlistDescription: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 2,
  },
  playlistSongCount: {
    fontSize: 12,
    color: '#7ed6f7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#7ed6f7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  createButtonText: {
    color: '#23292e',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7ed6f7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#2a3138',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4147',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#3a4147',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchGroup: {
    marginBottom: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#aaa',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#3a4147',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3a4147',
  },
  confirmButton: {
    backgroundColor: '#7ed6f7',
  },
  cancelButtonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#23292e',
    fontSize: 16,
    fontWeight: '600',
  },
  // 플레이리스트 액션 관련 스타일
  playlistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playlistMenuButton: {
    padding: 8,
    borderRadius: 20,
  },
  // 액션시트 스타일
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetBackdrop: {
    flex: 1,
  },
  actionSheetContainer: {
    backgroundColor: '#2a3138',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34, // Safe area bottom
  },
  actionSheetHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4147',
    alignItems: 'flex-start',
  },
  actionSheetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionSheetTitleIcon: {
    marginRight: 8,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  actionSheetCancelButton: {
    borderTopWidth: 1,
    borderTopColor: '#3a4147',
    justifyContent: 'center',
  },
  actionSheetDeleteText: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '500',
  },
  actionSheetCancelText: {
    fontSize: 16,
    color: '#aaa',
    fontWeight: '500',
  },
});
