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
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  optionContainer: {
    backgroundColor: '#2c3540',
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a4149',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#1a4a5c',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#7ed6f7',
  },
  optionDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  selectedOptionDescription: {
    color: '#b3e5fc',
  },
});
