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
            const accesstoken = await AsyncStorage.getItem('acesstoken');
            const refreshtoken = await AsyncStorage.getItem('refreshtoken');
            if (accesstoken == null) {
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
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    Reifenmanagement
                </Text>
            </View>
        );
    }
}
