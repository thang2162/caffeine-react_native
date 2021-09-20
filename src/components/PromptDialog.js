import React from 'react';
import {Button, Caption, Dialog, Portal, TextInput} from 'react-native-paper';

const PromptDialog = ({
  show,
  onDismiss,
  title,
  message,
  txtInputlabel,
  txtInputplaceholder,
  confirmLabel,
  value,
  onValueChange = null,
  onConfirm = null,
}) => {
  return (
    <>
      <Portal>
        <Dialog visible={show} onDismiss={() => onDismiss()}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Caption>
              {message}
            </Caption>
            <TextInput
              keyboardType="number-pad"
              label={txtInputlabel}
              placeholder={txtInputplaceholder}
              value={value}
              onChangeText={amt => onValueChange(amt)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => onDismiss()}>Cancel</Button>
            <Button mode="contained" onPress={() => onConfirm(value)}>
              {confirmLabel}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default PromptDialog;
