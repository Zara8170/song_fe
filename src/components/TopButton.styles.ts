import { StyleSheet } from 'react-native';

export const topButtonStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    zIndex: 100,
  },
  button: {
    backgroundColor: '#23292e',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  arrow: {
    color: '#7ed6f7',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
