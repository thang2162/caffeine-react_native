import React from 'react';
import {Button, Paragraph, Dialog, Portal} from 'react-native-paper';

const StatusDialog = ({
  show,
  title,
  message,
  onDismiss,
  isConfirm = false,
  onConfirm = null,
}) => {
  return (
    <>
      {/*Status Dialog*/}
      <Portal>
        <Dialog visible={show} onDismiss={() => onDismiss()}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Content>
            <Paragraph>{message}</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            {!isConfirm && (
              <>
                <Button onPress={() => onDismiss()}>Done</Button>
              </>
            )}
            {isConfirm && (
              <>
                <Button onPress={() => onDismiss()}>No</Button>
                <Button mode="contained" onPress={() => onConfirm()}>
                  Yes
                </Button>
              </>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default StatusDialog;
