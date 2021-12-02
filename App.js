import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {SplashScreen} from "./SplashScreen";
import LoginScreen from "./Login";
import NewRaceScreen from "./NewRace";
import RaceScreen from "./RaceScreen";


const MainNavigator = createStackNavigator({
    NewRace: { screen: NewRaceScreen},
    Race: {screen: RaceScreen},
    NewUser: {}
    }, {
    initialRouteName: "TaskList",
    headerMode: 'none',
    headerShown: false,
    });


const AppNavigator = createStackNavigator({
    Splash: {
        screen: SplashScreen,
        },
    Login: {
        screen: LoginScreen,
        },
    MainNav:{
        screen : MainNavigator,
        }
    },
    {
        initialRouteName: "Splash",
        headerMode: 'none',
        headerShown: false,
        });

export default createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    conceptInput: {
        height: 30,
        width: 200,
        fontSize: 30,
        borderColor: 'black',
        borderWidth: 1,
    },
});
