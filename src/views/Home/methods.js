import React from 'react';
import {formatDistanceToNowStrict} from 'date-fns';
import {Subheading, List} from 'react-native-paper';

const initialPrompt = {
  show: false,
  caffeineAmt: '',
  maxCaffeineAmt: 0,
};

const initialStatus = {
  statusDialog: false,
  statusTitle: '',
  statusMessage: '',
  dbItem: null,
};

const renderItem = (itm, status, setStatus) => {
  const item = itm.item;
  return (
    <List.Item
      title={item.name}
      description={`${formatDistanceToNowStrict(item.dateTime)} ago`}
      left={() => <List.Icon icon="bottle-soda-outline" />}
      right={() => (
        <>
          <Subheading>{`${item.caffeineLevel} mg`}</Subheading>
        </>
      )}
      onPress={() =>
        setStatus({
          ...status,
          statusDialog: true,
          statusTitle: 'Remove Drink?',
          statusMessage: item.name,
          dbItem: item,
        })
      }
    />
  );
};

const updateView = (
  toggleLoader,
  getMaxCaffeine,
  getDrinks,
  setCaffeineLvl,
  setDrinkList,
  setPrompt,
  prompt,
  setProgress,
) => {
  return new Promise(resolve => {
    toggleLoader(true).then(() => {
      getMaxCaffeine().then(maxCaffeine => {
        getDrinks().then(res => {
          console.log('getDrinks', JSON.stringify(res));
          toggleLoader(false).then(() => {
            setCaffeineLvl(res.currentCaffeineLevel);
            setDrinkList(res.drinksList);
            setPrompt({
              ...prompt,
              maxCaffeineAmt: maxCaffeine,
              caffeineAmt: maxCaffeine,
            });
            if (Number(res.currentCaffeineLevel / maxCaffeine) >= 1) {
              setProgress(1);
            } else if (Number(res.currentCaffeineLevel / maxCaffeine) <= 0) {
              setProgress(0);
            } else {
              const percent = Number(res.currentCaffeineLevel / maxCaffeine);
              if (isNaN(percent) === false) {
                setProgress(percent);
              } else {
                setProgress(0);
              }
            }
            resolve();
          });
        });
      });
    });
  });
};

const hideDialog = (prompt, setPrompt, setStatus, initialStatus) => {
  setPrompt({...prompt, show: false, caffeineAmt: prompt.maxCaffeineAmt});
  setStatus(initialStatus);
};

export {initialPrompt, initialStatus, hideDialog, renderItem, updateView};
