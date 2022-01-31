import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {SplashScreen} from "./SplashScreen";
import LoginScreen from "./Login";
import NewRaceScreen from "./NewRace";
import RaceScreen from "./RaceScreen";
import NewUserScreen from "./NewUser";
import NewHelpScreen from "./HelperScreen";
import FormelScreen from "./FormelScreen";
import {NavScreen} from "./NavScreen";
import LogoutScreen from "./LogoutScreen";
import NewOrderScreen from "./NewOrder";
import WeatherScreen from "./WeatherScreen";
import IngenieurNav from "./IngenieurNav";
import ShowRaceScreen from "./ShowRace";
import WheelScreen from "./Reifenmanagement";
import AstridScreen from "./Astrid";
import TestScreen from "./Testen";
import NiklasScreen from "./Niklas";
import MaenScreen from "./Maen";
import NewFormelScreen  from "./NewFormel";

const IngeniuerNav = createStackNavigator({
    Wetter:{screen: WeatherScreen},
    Formel:{screen:FormelScreen},
    Logout: {screen: LogoutScreen},
    Nav: {screen: IngenieurNav},
    Wheel: {screen: WheelScreen},
    /*NewUser: {}*/
    }, {
    initialRouteName: "Nav",
    headerMode: 'none',
    headerShown: false,
    });

const HelperNav = createStackNavigator({
    Helper: {screen:NewHelpScreen },
    Logout: {screen: LogoutScreen},
    }, {
    initialRouteName: "Helper",
    headerMode: 'none',
    headerShown: false,
    });

const ManagerNav = createStackNavigator({
    NewRace: { screen: NewRaceScreen},
    Race: {screen: RaceScreen},
    NewUser: {screen: NewUserScreen},
    Formel: {screen: FormelScreen},
    Logout: {screen: LogoutScreen},
    NewOrder: {screen: NewOrderScreen},
    Weather: {screen: WeatherScreen},
    ShowRace : {screen :ShowRaceScreen},
    Wheel: {screen: WheelScreen},
    NewFormel: {screen: NewFormelScreen},
    Astrid: {screen: AstridScreen},
    Niklas: {screen: NiklasScreen},
    Testen: {screen: TestScreen},
    Maen: {screen: MaenScreen},

    }, {
    initialRouteName: "Race",
    headerMode: 'none',
    headerShown: false,
    });

const MainNavigator = createStackNavigator({
    Ingenieur: { screen: IngeniuerNav},
    Manager: {screen: ManagerNav},
    Helper: {screen: HelperNav },
    NavScreen: {screen:NavScreen},
    }, {
    initialRouteName: "NavScreen",
    headerMode: 'none',
    headerShown: false,
    });

const AppNavigator = createStackNavigator({
    Splash: {screen: SplashScreen},
    Login: {
        screen: LoginScreen},
    MainNav:{
        screen : MainNavigator},
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
