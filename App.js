import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/screens/Home';
import IntroSlider from './components/screens/IntroSlider';
import Aadhar from './components/screens/kycScreens/Aadhar';
import Pan from './components/screens/kycScreens/Pan';
import Verify from './components/screens/kycScreens/Verify';
import Success from './components/screens/kycScreens/Success';
import Failed from './components/screens/kycScreens/Failed';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{
    headerShown: false
  }} >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="IntroSlider" component={IntroSlider} />
        <Stack.Screen name="Aadhar" component={Aadhar} />
        <Stack.Screen name="Pan" component={Pan} />
        <Stack.Screen name="Verify" component={Verify} />
        <Stack.Screen name="Success" component={Success} />
        <Stack.Screen name="Failed" component={Failed} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
