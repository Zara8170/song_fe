import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  searchBoxWrapper: {
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  searchBoxInner: {
    position: 'relative',
    width: '100%',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#363c44',
    borderRadius: 12,
    height: 48,
    color: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    paddingRight: 48,
  },
  searchIconWrapper: {
    position: 'absolute',
    right: 8,
    top: 6,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconBg: {
    backgroundColor: '#7ed6f7',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // MainScreen에서 가져온 탭바 스타일들
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingVertical: 8,
    borderRadius: 16,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  tabTextActive: {
    color: '#7ed6f7',
    backgroundColor: '#2d3436',
  },
  tabTextInactive: {
    color: '#aaa',
    backgroundColor: 'transparent',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    width: '33.33%',
    height: 4,
    backgroundColor: '#7ed6f7',
    borderRadius: 2,
    zIndex: 1,
  },
  // MainScreen에서 가져온 리스트 스타일들
  list: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#ff7675',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  noResultText: {
    color: '#aaa',
    fontSize: 16,
  },
});

export default styles;
