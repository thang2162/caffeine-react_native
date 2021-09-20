import {Alert} from 'react-native';

const initialState = {
  isCamActive: false,
  isScannerActive: false,
  flashLight: false,
};

const initialStatus = {
  statusDialog: false,
  statusTitle: '',
  statusMessage: '',
};

const hideDialog = (status, setStatus, state, setState) => {
  setStatus({
    ...status,
    statusDialog: false,
    statusMessage: '',
    statusTitle: '',
  });
  setState({...state, isScannerActive: true});
};

const toggleFlashLight = (state, setState) => {
  if (state.flashLight === false) {
    setState({...state, flashLight: true});
  } else {
    setState({...state, flashLight: false});
  }
};

const handleScan = (netInfo, result, state, setState, status, setStatus, toggleLoader, props) => {
  console.log('handleScan', result);
  setState({...state, isScannerActive: false});
  if (netInfo.isConnected && netInfo.isConnected === true) {
    toggleLoader(true).then(() => {
      fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${result.data}`, {
        method: 'GET'
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          toggleLoader(false).then(() => {
            console.log('handleScanLookUpRes', data)
            if (data.items.length > 0 && data.items[0].category.includes('Food, Beverages & Tobacco > Beverages')) {
              console.log(data.items[0].title, data.items[0].brand);
              props.navigation.navigate('AddDrink', {
                upcTitle: data.items[0].title,
                upcBrand: data.items[0].brand
              })
            } else {
              setStatus({
                ...status,
                statusDialog: true,
                statusTitle: 'Drink not found',
                statusMessage: 'Please try a diffent UPC.',
              });
            }
              /* props.navigation.navigate('WaitingRoom', {
                apiKey: String(data.openTokApiKey),
                whenScheduled: data.whenScheduled,
                consultObj: data,
                sessionId: data.videoSessionId,
                token: data.primaryPatientToken,
              }); */
          });
        })
        .catch(error => {
          toggleLoader(false).then(() => {
            setStatus({
              ...status,
              statusDialog: true,
              statusTitle: 'No Result',
              statusMessage: 'UPC not found!',
            });
          });
        });
    });
  } else {
    setStatus({
      ...status,
      statusDialog: true,
      statusTitle: 'No Internet',
      statusMessage: 'An internet connection is requied to use this feature!',
    });
  }
};

export {initialState, initialStatus, hideDialog, handleScan, toggleFlashLight};
