import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  topHeader: {
    backgroundColor: '#23292e',
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
  list: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
