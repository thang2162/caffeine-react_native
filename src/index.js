import React, {useReducer, useMemo, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StyleSheet, Platform, Alert, BackHandler, LogBox} from 'react-native';
import {Provider as PaperProvider, Snackbar} from 'react-native-paper';
import PageLoader from './components/PageLoader';
import StackNavigator from './router';
import {MainContext, MainReducer, MainInitState} from './store';
import {MainMemo, MemoContext} from './utils/memo';
import RNBootSplash from "react-native-bootsplash";

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const App = () => {
  const [store, dispatch] = useReducer(MainReducer, MainInitState);
  const memoContext = useMemo(MainMemo(store, dispatch), [store]);

  return (
    <MainContext.Provider value={{store, dispatch}}>
      <MemoContext.Provider value={memoContext}>
        <PaperProvider>
          <NavigationContainer onReady={() => RNBootSplash.hide()}>
            <PageLoader message="Please Wait..." isActive={store.isLoading} />
            <StackNavigator />
            <Snackbar
              visible={store.status.show}
              duration={store.status.duration}
              style={styles.globalStatus}
              wrapperStyle={styles.wrapper}
              onDismiss={() => {
                dispatch({
                  type: 'set',
                  status: {
                    show: false,
                    message: '',
                    duration: store.status.duration,
                  },
                });
              }}>
              {store.status.message}
            </Snackbar>
          </NavigationContainer>
        </PaperProvider>
      </MemoContext.Provider>
    </MainContext.Provider>
  );
};

const styles = StyleSheet.create({
  globalStatus: {
    marginBottom: 25,
    zIndex: 9999,
    backgroundColor: '#5400e6',
    color: 'white',
  },
  wrapper: {
    zIndex: 9999,
  },
});

export default App;
