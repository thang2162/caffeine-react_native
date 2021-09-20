import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../views/Home';
import BarcodeScannerScreen from '../views/BarcodeScanner';
import AddDrinkScreen from '../views/AddDrink';

const Stack = createNativeStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="AddDrink" component={AddDrinkScreen} options={{animation: 'slide_from_left'}}/>
        <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen}/>
    </Stack.Navigator>
);

export default StackNavigator;
