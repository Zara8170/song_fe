import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 80,
    left: width * 0.1,
    width: width * 0.8,
    backgroundColor: '#23292e',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default styles;
