import React from "react";
import {Text, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList} from "./tools";


export class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    async checkLogin(){
            const accesstoken = await AsyncStorage.getItem('accesstoken');
            const refreshtoken = await AsyncStorage.getItem('refreshtoken');
            if (accesstoken == null) {
                console.log(accesstoken)
                this.props.navigation.replace('Login');
            }
            else {
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
            <View style={{overflowY: 'scroll', flex: 1, backgroundColor: '#2e3742'}}>
            <h1 className="display-6" style={{color: '#d0d7de', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto'}}> Reifenmanagement </h1>
            </View>
        );
    }
}
