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
});

export default styles;
