import React from 'react';
import {Subheading, List} from 'react-native-paper';

const initialPrompt = {
  show: false,
  drinkName: '',
  caffeineAmt: '',
};

const initialStatus = {
  statusDialog: false,
  statusTitle: '',
  statusMessage: '',
  drinkName: '',
  caffeineAmt: '',
  isConfirm: true,
};

const hideDialogs = (prompt, setPrompt, setStatus, reset = false) => {
  if (reset === true) {
    setPrompt(initialPrompt);
  } else {
    setPrompt({...prompt, show: false});
  }
  setStatus(initialStatus);
};

const renderItem = (itm, status, setStatus) => {
  const item = itm.item;
  return (
    <List.Item
      title={item.drinkName}
      description={`${item.flOz} fl oz.`}
      left={() => <List.Icon icon="bottle-soda-outline" />}
      right={() => (
        <>
          <Subheading>{`${item.caffeineMg} mg`}</Subheading>
        </>
      )}
      onPress={() =>
        setStatus({
          ...status,
          statusDialog: true,
          statusTitle: 'Add Drink?',
          statusMessage: `${item.drinkName} - ${item.flOz} fl oz.`,
          drinkName: item.drinkName,
          caffeineAmt: item.caffeineMg,
          isConfirm: true,
        })
      }
    />
  );
};

export {initialPrompt, initialStatus, hideDialogs, renderItem};
