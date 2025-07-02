import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  topHeader: {
    backgroundColor: '#23292e',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  headerId: {
    color: '#7ed6f7',
    width: 60,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    flex: 2,
    fontWeight: 'bold',
  },
  headerArtist: {
    color: '#fff',
    flex: 1.5,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#23292e',
  },
  id: {
    color: '#7ed6f7',
    width: 60,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    flex: 2,
    fontWeight: 'bold',
  },
  artist: {
    color: '#fff',
    flex: 1.5,
    fontWeight: 'bold',
  },
});
