import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 998,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#363c44',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 190,
    maxWidth: 220,
    zIndex: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#7ed6f7',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    minHeight: 48,
  },
  optionSelected: {
    backgroundColor: 'rgba(126, 214, 247, 0.1)',
  },
  optionFirst: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  optionLast: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    color: '#aaa',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  optionTextSelected: {
    color: '#7ed6f7',
    fontWeight: 'bold',
  },
});

export default styles;
