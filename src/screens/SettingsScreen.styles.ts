import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    flex: 1,
    backgroundColor: '#23292e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3540',
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  menuSection: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3540',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#ff6b6b',
    fontWeight: '500',
  },
});
