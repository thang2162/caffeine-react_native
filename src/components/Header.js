import React from 'react';
import {Appbar} from 'react-native-paper';

const Header = ({
  title,
  subtitle,
  navigation,
  showBackBtn = false,
  showAddDrinkBtn = true,
  showOptionsBtn = true,
  optionsCallback = null,
  showFlashLightBtn = false,
  flashLightCallback = null,
  flashLightState = false,
}) => {
  const _handleSearch = () => console.log('Searching');

  return (
    <Appbar.Header>
      {showBackBtn && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={title} subtitle={subtitle} />
      {showOptionsBtn && (
        <Appbar.Action icon="cog-outline" onPress={() => optionsCallback()} />
      )}
      {showAddDrinkBtn && (
        <Appbar.Action
          icon="plus"
          onPress={() => navigation.navigate('AddDrink')}
        />
      )}
      {showFlashLightBtn && (
        <Appbar.Action
          icon={flashLightState ? 'flashlight-off' : 'flashlight'}
          onPress={() => flashLightCallback()}
        />
      )}
    </Appbar.Header>
  );
};

export default Header;
