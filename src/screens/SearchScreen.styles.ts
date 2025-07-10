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
  errorText: {
    color: '#ff7675',
    textAlign: 'center',
    marginBottom: 8,
  },
  recentWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentTitle: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 15,
  },
  recentClear: {
    color: '#7ed6f7',
    fontWeight: 'bold',
    fontSize: 14,
    padding: 4,
  },
  recentKeyword: {
    color: '#4b8cff',
    fontWeight: 'bold',
    fontSize: 16,
    height: 36,
    lineHeight: 36,
    marginBottom: 4,
    borderRadius: 8,
    paddingLeft: 4,
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
