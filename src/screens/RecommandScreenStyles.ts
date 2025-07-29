import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23292e',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23292e',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4FC3F7',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
  },

  // 빠른 선곡 스타일
  quickPickList: {
    paddingLeft: 16,
  },
  quickPickCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: screenWidth * 0.7,
    minHeight: 120,
  },
  songTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 22,
  },
  artistName: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 12,
  },
  karaokeCodes: {
    flexDirection: 'row',
    gap: 8,
  },
  karaokeCode: {
    backgroundColor: '#4FC3F7',
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  // 테마별 선곡 스타일
  themeGroupContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  themeGroupTitle: {
    color: '#4FC3F7',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  themeSongCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeSongInfo: {
    flex: 1,
    marginRight: 12,
  },
  themeSongTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeSongArtist: {
    color: '#bbb',
    fontSize: 14,
  },
  themeKaraokeCodes: {
    flexDirection: 'row',
    gap: 4,
  },
  themeKaraokeCode: {
    backgroundColor: '#4FC3F7',
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 32,
    textAlign: 'center',
  },
});

export default styles;
