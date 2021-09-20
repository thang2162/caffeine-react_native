import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
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
  List,
} from 'react-native-paper';
import Header from '../../components/Header';
import {useIsFocused} from '@react-navigation/native';
import styles from './styles';
import PromptDialog from '../../components/PromptDialog';
import StatusDialog from '../../components/StatusDialog';
import BackPressHandler from '../../utils/BackPressHandler';
import {MemoContext} from '../../utils/memo';
import {
  initialPrompt,
  initialStatus,
  hideDialog,
  renderItem,
  updateView,
} from './methods';

const Home = props => {
  const isFocused = useIsFocused();
  const [timer, setTimer] = useState(Date.now());
  const [iv, setIv] = useState();
  const [caffeineLvl, setCaffeineLvl] = useState(0);
  const [drinkList, setDrinkList] = useState([]);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(initialStatus);
  const {
    toggleLoader,
    showGlobalStatus,
    getDrinks,
    getMaxCaffeine,
    setMaxCaffeine,
    removeDrink,
  } = useContext(MemoContext);

  useEffect(BackPressHandler, []);
  useEffect(() => {
    if (isFocused === true) {
      updateView(
        toggleLoader,
        getMaxCaffeine,
        getDrinks,
        setCaffeineLvl,
        setDrinkList,
        setPrompt,
        prompt,
        setProgress,
      );
      setIv(
        setInterval(() => {
          setTimer(Date.now());
        }, 1000),
      );
    } else {
      clearInterval(iv);
    }
  }, [isFocused]);

  useEffect(() => {
    console.log('timer', timer);
    drinkList.map(x => {
      if (x.dateTime.getTime() - Date.now() <= -86400000) {
        setTimeout(() => {
          setDrinkList([]);
          removeDrink(x).then(() => {
            updateView(
              toggleLoader,
              getMaxCaffeine,
              getDrinks,
              setCaffeineLvl,
              setDrinkList,
              setPrompt,
              prompt,
              setProgress,
            );
          });
        }, 0);
      }
    });
  }, [timer]);

  return (
    <View style={styles.mainView}>
      <Header
        title="Home"
        subtitle="Your Caffeine Overview"
        navigation={props.navigation}
        optionsCallback={() => setPrompt({...prompt, show: true})}
      />
      <View style={styles.topView}>
        <Card style={styles.topCard}>
          <Card.Title
            title="Caffeine"
            left={props => <Avatar.Icon {...props} icon="coffee" />}
          />
          <Card.Content>
            <Paragraph>Daily Caffeine:</Paragraph>
            <ProgressBar progress={progress} color={Colors.orange500} />
            <Paragraph>
              Remaining Caffeine Level: {prompt.maxCaffeineAmt - caffeineLvl} mg
            </Paragraph>
            <Paragraph>Caffeine Consumed: {caffeineLvl} mg</Paragraph>
            <Paragraph>
              Daily Caffeine Limit: {prompt.maxCaffeineAmt} mg
            </Paragraph>
            {caffeineLvl < prompt.maxCaffeineAmt && (
              <Subheading style={styles.topSubheading}>
                You are under your daily limit!
              </Subheading>
            )}
            {caffeineLvl == prompt.maxCaffeineAmt && (
              <Subheading style={styles.topSubheading}>
                You are at your daily limit!
              </Subheading>
            )}
            {caffeineLvl > prompt.maxCaffeineAmt && (
              <Subheading style={styles.topSubheading}>
                You are over your daily limit!
              </Subheading>
            )}
          </Card.Content>
        </Card>
      </View>
      <Card style={styles.bottomCard}>
        <Title style={styles.bottomTitle}>Caffeine Consumption</Title>
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
            keyExtractor={item => `${item.drinkName}_${item._id}`}
          />
          {drinkList.length === 0 && (
            <View style={styles.noResult}>
              <Subheading style={styles.noResultSh}>
                Please add a drink to get started!
              </Subheading>
            </View>
          )}
        </List.Section>
      </Card>
      {/*Max Caffeine Level Prompt*/}
      <PromptDialog
        show={prompt.show}
        value={prompt.caffeineAmt}
        onDismiss={() =>
          hideDialog(prompt, setPrompt, setStatus, initialStatus)
        }
        title="Adjust Daily Max Caffeine"
        message="What is the maximum level of caffeine you can safely consume in a single day?"
        txtInputlabel="Your Daily Max Amount of Caffeine"
        txtInputplaceholder="Max Amount of Caffeine in Milligrams"
        confirmLabel="Save"
        onValueChange={amt => setPrompt({...prompt, caffeineAmt: amt})}
        onConfirm={raw => {
          const amt = Number(raw);
          if (typeof amt === 'number') {
            console.log('Max Caffeine Level Prompt', amt);
            setMaxCaffeine(amt);
            setPrompt({...prompt, show: false, maxCaffeineAmt: amt});
          } else {
            showGlobalStatus('Please Use Digits Only!', 3000);
          }
        }}
      />
      {/*Confirm Delete*/}
      <StatusDialog
        show={status.statusDialog}
        title={status.statusTitle}
        message={status.statusMessage}
        onDismiss={() =>
          hideDialog(prompt, setPrompt, setStatus, initialStatus)
        }
        isConfirm={true}
        onConfirm={() => {
          toggleLoader(true).then(() => {
            setTimeout(() => {
              setDrinkList([]);
              removeDrink(status.dbItem).then(() => {
                toggleLoader(false).then(() => {
                  updateView(
                    toggleLoader,
                    getMaxCaffeine,
                    getDrinks,
                    setCaffeineLvl,
                    setDrinkList,
                    setPrompt,
                    prompt,
                    setProgress,
                  ).then(() => {
                    hideDialog(prompt, setPrompt, setStatus, initialStatus);
                    showGlobalStatus('Drink Removed!', 3000);
                  });
                });
              });
            }, 0);
          });
        }}
      />
    </View>
  );
};

export default Home;
