import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23292e',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  developmentText: {
    fontSize: 60,
    marginBottom: 20,
  },
  developmentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  developmentSubtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 24,
  },
  headerContainer: {
    backgroundColor: '#23292e',
    paddingBottom: 14,
    paddingLeft: 18,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 18,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 10,
  },
  appIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 10,
  },
  appTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingLeft: 10,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 40,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#2c3540',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
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
