import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {
  ProgressBar,
  Colors,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Subheading,
  Divider,
  TextInput,
  List,
} from 'react-native-paper';
import {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';
import beverages from '../../assets/beverages.json';
import Header from '../../components/Header';
import {MemoContext} from '../../utils/memo';
import StatusDialog from '../../components/StatusDialog';
import PromptDialog from '../../components/PromptDialog';
import styles from './styles';
import {initialPrompt, initialStatus, hideDialogs, renderItem} from './methods';

const AddDrink = props => {
  const netInfo = useNetInfo();
  const isFocused = useIsFocused();
  const [drinkList, setDrinkList] = useState([]);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [status, setStatus] = useState(initialStatus);
  const {toggleLoader, showGlobalStatus, addDrink} = useContext(MemoContext);

  useEffect(() => {
    if (isFocused === true) {
      setDrinkList(beverages);
      console.log('listSearch Before', props.route.params);
      if (
        props.route.params &&
        (props.route.params.upcTitle !== '' ||
          props.route.params.upcBrand !== '')
      ) {
        console.log('listSearch', props.route.params);
        const listSearch = beverages.filter(item =>
          item.drinkName
            .toLowerCase()
            .includes(
              props.route.params.upcBrand === ''
                ? props.route.params.upcTitle.toLowerCase()
                : props.route.params.upcBrand.toLowerCase(),
            ),
        );
        setPrompt({
          ...prompt,
          drinkName:
            props.route.params.upcBrand === ''
              ? props.route.params.upcTitle.toLowerCase()
              : props.route.params.upcBrand.toLowerCase(),
          caffeineAmt: '',
        });
        setDrinkList(listSearch);
        if (listSearch.length === 1) {
          setStatus({
            ...status,
            statusDialog: true,
            statusTitle: 'Add Drink?',
            statusMessage: `${listSearch[0].drinkName} - ${listSearch[0].flOz} fl oz.`,
            drinkName: listSearch[0].drinkName,
            caffeineAmt: listSearch[0].caffeineMg,
            isConfirm: true,
          });
        }
      }
    } else {
      setStatus(initialStatus);
      setPrompt(initialPrompt);
    }
  }, [isFocused]);

  return (
    <View style={styles.mainView}>
      <Header
        title="Add Drink"
        subtitle="Track Your Caffeine"
        navigation={props.navigation}
        showBackBtn={true}
        showOptionsBtn={false}
        showAddDrinkBtn={false}
      />
      <View style={styles.topView}>
        <Card style={styles.topCard}>
          <Card.Content>
            <TextInput
              label="Beverage Name"
              placeholder="Beverage Name"
              value={prompt.drinkName}
              onChangeText={drinkName => {
                setPrompt({...prompt, drinkName: drinkName, caffeineAmt: ''});
                setDrinkList(
                  beverages.filter(item =>
                    item.drinkName
                      .toLowerCase()
                      .includes(drinkName.toLowerCase()),
                  ),
                );
              }}
            />
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              icon="barcode-scan"
              mode="contained"
              color={Colors.orange500}
              dark={true}
              onPress={() => {
                if (netInfo.isConnected && netInfo.isConnected === true) {
                  props.navigation.navigate('BarcodeScanner', {
                    mode: 'scanner',
                  });
                } else {
                  setStatus({
                    ...status,
                    statusDialog: true,
                    statusTitle: 'No Internet',
                    statusMessage:
                      'An internet connection is requied to use this feature!',
                    drinkName: '',
                    caffeineAmt: '',
                    isConfirm: false,
                  });
                }
              }}>
              Scan UPC
            </Button>
            <Button
              icon="plus"
              mode="contained"
              color={Colors.green500}
              dark={true}
              disabled={prompt.drinkName === '' ? true : false}
              onPress={() => setPrompt({...prompt, show: true})}>
              Add
            </Button>
          </Card.Actions>
        </Card>
      </View>
      <Card style={styles.bottomCard}>
        <Subheading style={styles.bottomTitle}>
          Add Drink or Select One Below.
        </Subheading>
        <View style={styles.bottomView}>
          <Subheading style={styles.bottomSh1}>Beverage</Subheading>
          <Subheading style={styles.bottomSh2}>|</Subheading>
          <Subheading style={styles.bottomSh3}>Caffeine</Subheading>
        </View>
        <Divider />
        <List.Section>
          <FlatList
            style={styles.flatList}
            data={drinkList}
            renderItem={itm => renderItem(itm, status, setStatus)}
            keyExtractor={item => `${item.drinkName}_${item.caffeineMgFlOz}`}
          />
          {drinkList.length === 0 && (
            <Subheading style={styles.noResult}>No Results Found...</Subheading>
          )}
        </List.Section>
      </Card>
      {/*Caffeine Level Prompt*/}
      <PromptDialog
        show={prompt.show}
        value={prompt.caffeineAmt}
        onDismiss={() => hideDialogs(prompt, setPrompt, setStatus)}
        title="How much caffeine?"
        message="How many milligrams caffeine are in this drink?"
        txtInputlabel="Amount of Caffeine in Drink"
        txtInputplaceholder="Amount of Caffeine in Milligrams"
        confirmLabel="Add Drink"
        onValueChange={amt => setPrompt({...prompt, caffeineAmt: amt})}
        onConfirm={amt => {
          toggleLoader(true).then(() => {
            setTimeout(() => {
              addDrink(prompt.drinkName, Number(amt)).then(res => {
                toggleLoader(false).then(() => {
                  if (res.success === true) {
                    hideDialogs(prompt, setPrompt, setStatus, true);
                    showGlobalStatus('Drink Successfully Saved!', 3000);
                    props.navigation.navigate('Home');
                  } else {
                    hideDialogs(prompt, setPrompt, setStatus, false);
                    showGlobalStatus(
                      res.message ? res.message : 'Error: Drink Not Saved!',
                      3000,
                    );
                  }
                });
              });
            }, 0);
          });
        }}
      />
      {/*Confirm Add Drink*/}
      <StatusDialog
        show={status.statusDialog}
        title={status.statusTitle}
        message={status.statusMessage}
        onDismiss={() => hideDialogs(prompt, setPrompt, setStatus)}
        isConfirm={status.isConfirm}
        onConfirm={() => {
          toggleLoader(true).then(() => {
            setTimeout(() => {
              addDrink(status.drinkName, Number(status.caffeineAmt)).then(
                res => {
                  toggleLoader(false).then(() => {
                    if (res.success === true) {
                      hideDialogs(prompt, setPrompt, setStatus, false);
                      showGlobalStatus('Drink Successfully Saved!', 3000);
                      props.navigation.navigate('Home');
                    } else {
                      hideDialogs(prompt, setPrompt, setStatus, false);
                      showGlobalStatus(
                        res.message ? res.message : 'Error: Drink Not Saved!',
                        3000,
                      );
                    }
                  });
                },
              );
            }, 0);
          });
        }}
      />
    </View>
  );
};

export default AddDrink;
