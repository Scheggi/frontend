import React from "react";
import {Text, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData} from "./tools";


export class NewRaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            access: null,
            refresh: null
        };
    }

    async startsyncData() {
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        await syncData(accesstoken);
    }
    async checkLogin(){
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const refreshtoken = await AsyncStorage.getItem('refreshtoken');
        if (accesstoken == null) {
            this.props.navigation.replace('Login');
        }
        else {
            this.setState({access: accesstoken});
            this.setState({refresh: refreshtoken});
            await this.startsyncData();
            this.props.navigation.replace('MainNav');
        }
    }

    async componentDidMount() {
        try {
            this.focusListener = this.props.navigation.addListener('didFocus', () => {
                this.checkLogin()
            })

        } catch (e) {
            ToastAndroid.show(e, ToastAndroid.SHORT);
        }

    }
    componentWillUnmount () {
        this.focusListener.remove()
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    24 Stunden Rennen
                </Text>
            </View>
        );
    }
}
