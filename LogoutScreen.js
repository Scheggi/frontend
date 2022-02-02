import React from "react";
import {TextInput, Button, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise} from "./tools"
import Text from "react-native-web/dist/vendor/react-native/Animated/components/AnimatedText";



export default class LogoutScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
        };
    }

    async sendLogoutRequest() {
        console.log("Logout")
        const accesstoken = await AsyncStorage.getItem('accesstoken');
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/user/auth/logout', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
               body: JSON.stringify({
                   access_token: accesstoken,
               })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    AsyncStorage.clear()
                    this.props.navigation.navigate('AppNavigator',{screen: "Splash"});

                }
                else {
                    console.log("Logout failed")
                    //AsyncStorage.clear()
                    //this.props.navigation.replace("Race")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    componentDidMount() {
        this.sendLogoutRequest()
    }

    render() {
        return (
            <View style={{overflowY: 'scroll', flex: 1, backgroundColor: '#2e3742'}}>
            <h1 className="display-6" style={{color: '#d0d7de', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto'}}> Sie wurden erfolgreich ausgeloggt! </h1>
            </View>
        );
    }
}