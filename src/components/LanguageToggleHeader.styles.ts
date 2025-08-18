import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  toggleContainer: {
    marginRight: 16,
    backgroundColor: '#2c3540',
    borderRadius: 20,
    padding: 2,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    width: 130,
    overflow: 'hidden',
  },
  toggleOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingHorizontal: 4,
    height: 32,
  },
  selectedOption: {
    backgroundColor: '#7ed6f7',
    borderRadius: 18,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedText: {
    color: '#23292e',
  },
  unselectedText: {
    color: '#aaa',
  },
});
