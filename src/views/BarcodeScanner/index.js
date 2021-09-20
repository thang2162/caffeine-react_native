import React, {useEffect, useState, useContext} from 'react';
import {View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {
  BarcodeMaskWithOuterLayout,
  useBarcodeRead,
} from '@nartc/react-native-barcode-mask';
import {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';
import {MemoContext} from '../../utils/memo';
import Header from '../../components/Header';
import StatusDialog from '../../components/StatusDialog';

import styles from './styles';
import {
  initialState,
  initialStatus,
  hideDialog,
  handleScan,
  toggleFlashLight,
} from './methods';

const QrScannerScreen = props => {
  const netInfo = useNetInfo();
  const isFocused = useIsFocused();
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(initialStatus);
  const {toggleLoader, showGlobalStatus} = useContext(MemoContext);

  useEffect(() => {
    if (isFocused === true) {
      setState({...state, isCamActive: true, isScannerActive: true});
    } else {
      setState(initialState);
      setStatus(initialStatus);
    }
  }, [isFocused]);

  return (
    <>
      <View style={styles.mainview}>
        <Header
          title="Scan UPC"
          subtitle="Scan a UPC barcode to find your drink."
          navigation={props.navigation}
          showBackBtn={true}
          showOptionsBtn={false}
          showAddDrinkBtn={false}
          showFlashLightBtn={true}
          flashLightState={state.flashLight}
          flashLightCallback={() => {
            toggleFlashLight(state, setState);
          }}
        />
        {state.isCamActive && (
          <RNCamera
            androidCameraPermissionOptions={{
              title: 'Camera Access Requested',
              message: 'This function requires access to the camera.',
              buttonPositive: 'ok',
              buttonNegative: 'cancel',
            }}
            style={styles.scanner}
            flashMode={
              state.flashLight
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }
            type={RNCamera.Constants.Type.back}
            barCodeTypes={[
              RNCamera.Constants.BarCodeType.upce,
              RNCamera.Constants.BarCodeType.ean8,
              RNCamera.Constants.BarCodeType.ean13,
            ]}
            onBarCodeRead={
              state.isScannerActive
                ? result =>
                    handleScan(
                      netInfo,
                      result,
                      state,
                      setState,
                      status,
                      setStatus,
                      toggleLoader,
                      props,
                    )
                : null
            }
            captureAudio={false}>
            <BarcodeMaskWithOuterLayout
              showAnimatedLine={false}
              maskOpacity={0.5}
              width={200}
              height={200}
            />
          </RNCamera>
        )}
      </View>
      {/*Status Dialog*/}
      <StatusDialog
        show={status.statusDialog}
        title={status.statusTitle}
        message={status.statusMessage}
        onDismiss={() => hideDialog(status, setStatus, state, setState)}
      />
    </>
  );
};

export default QrScannerScreen;
