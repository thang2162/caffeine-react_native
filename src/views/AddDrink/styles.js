import {StyleSheet, Platform} from 'react-native';

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  topView: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 25,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  topCard: {
    marginHorizontal: 10,
  },
  topSubheading: {
    marginTop: 10,
  },
  mainview: {
    backgroundColor: 'purple',
    flex: 1,
    flexDirection: 'column',
  },
  bottomCard: {flexGrow: 1, flexShrink: 0, flexBasis: 375},
  bottomTitle: {paddingLeft: 15, paddingTop: 5, marginBottom: 10},
  bottomView: {flexDirection: 'row', justifyContent: 'space-between'},
  bottomSh1: {width: '55%', textAlign: 'center'},
  bottomSh2: {width: '15%', textAlign: 'right'},
  bottomSh3: {width: '20%', textAlign: 'center'},
  cardActions: {justifyContent: 'space-between', paddingHorizontal: 15},
  noResult: {paddingTop: 50, textAlign: 'center'},
  flatList: {
    ...Platform.select({
      ios: {
        marginBottom: 85,
      },
      android : {
        marginBottom: 65,
      },
    }),
  },
});

export default styles;
