import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3540',
    backgroundColor: '#23292e',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerLanguageToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#2d3436',
    borderRadius: 16,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLanguageText: {
    color: '#7ed6f7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBoxWrapper: {
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#363c44',
    borderRadius: 12,
    height: 48,
    overflow: 'hidden',
  },
  searchTypeButton: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#2d3436',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    minWidth: 80,
  },
  searchTypeText: {
    color: '#7ed6f7',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#363c44',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  searchInputWithType: {
    paddingLeft: 16,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  clearButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    color: '#fff',
    backgroundColor: '#3500CC',
    opacity: 1,
  },
  tabTextInactive: {
    color: '#aaa',
    backgroundColor: '#3500CC',
    opacity: 0.4,
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
