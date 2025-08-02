import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23292e',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    height: 100,
  },
  numberColumn: {
    flexDirection: 'column',
    marginRight: 8,
  },
  tjBox: {
    backgroundColor: '#FF5703',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  kyBox: {
    backgroundColor: '#EB431E',
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  songInfo: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  songTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  songSub: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  marqueeStyle: {
    width: '100%',
  },
  playlistAddButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  playlistRemoveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
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
    overflow: 'hidden',
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
    flexGrow: 1,
    padding: 16,
    maxHeight: 300,
  },
  playlistList: {
    maxHeight: 200,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#3a4147',
  },
  selectedPlaylistItem: {
    backgroundColor: '#4a5b67',
    borderWidth: 1,
    borderColor: '#7ed6f7',
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
    fontSize: 14,
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
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#2a3138',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#3a4147',
  },
  confirmButton: {
    backgroundColor: '#7ed6f7',
  },
  disabledButton: {
    backgroundColor: '#555',
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
  disabledButtonText: {
    color: '#777',
  },
});

export default styles;
