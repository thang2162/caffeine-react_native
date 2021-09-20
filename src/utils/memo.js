import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {saveDrink, getDrinks, removeDrink} from './db';

const MainMemo = (store, dispatch) => {
  const Memo = () => ({
    setScanResult: text => {
      dispatch({type: 'set', scanResult: text});
    },
    toggleLoader: showLoader => {
      console.log(showLoader);
      return new Promise(async resolve => {
        await dispatch({type: 'set', isLoading: showLoader});
        resolve();
      });
    },
    showGlobalStatus: (message, duration) => {
      dispatch({
        type: 'set',
        status: {show: true, message: message, duration: duration},
      });
    },
    addDrink: (name, caffeineLvl) => {
      return new Promise(resolve => {
        if (typeof name === 'string' && typeof caffeineLvl === 'number') {
          saveDrink(name, caffeineLvl).then(res => {
            if (res.success === true) {
              resolve({success: true});
            } else {
              resolve({success: false});
            }
          });
        } else {
          resolve({
            success: false,
            message:
              'name must be of type string and caffeineLvl must be of type number',
          });
        }
      });
    },
    getDrinks: () => {
      return new Promise(async resolve => {
        try {
          const drinks = await getDrinks();
          if (drinks.length === 0) {
            resolve({currentCaffeineLevel: 0, drinksList: drinks});
          } else if (drinks.length === 1) {
            resolve({
              currentCaffeineLevel: drinks[0].caffeineLevel,
              drinksList: drinks,
            });
          } else {
              resolve({
                currentCaffeineLevel: drinks.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.caffeineLevel, 0
                ),
                drinksList: drinks,
              });
          }
        } catch (e) {
          console.log(e);
        }
      });
    },
    removeDrink: item => {
      return new Promise(async resolve => {
        try {
          await removeDrink(item);
          resolve();
        } catch (e) {
          console.log(e);
        }
      });
    },
    setMaxCaffeine: max => {
      return new Promise(async resolve => {
        try {
          await AsyncStorage.setItem('MaxCaffeineLevel', max.toString());
          resolve();
        } catch (e) {
          console.log(e);
        }
      });
    },
    getMaxCaffeine: () => {
      return new Promise(async resolve => {
        try {
          const value = await AsyncStorage.getItem('MaxCaffeineLevel');
          if (value === null) {
            await AsyncStorage.setItem('MaxCaffeineLevel', String(500));
            resolve(500);
          } else {
            resolve(value);
          }
        } catch (e) {
          console.log(e);
        }
      });
    },
  });

  return Memo;
};

const MemoContext = React.createContext();

export {MainMemo, MemoContext};
