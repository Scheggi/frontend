import React from "react";
import {TextInput, Button, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise} from "./tools"
import Text from "react-native-web/dist/vendor/react-native/Animated/components/AnimatedText";



export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }
    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }
    handleSubmit = event => {
        event.preventDefault();
        this.sendLoginRequest(this.state.username, this.state.password);
    }


    async sendLoginRequest(username, password) {
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/user/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    AsyncStorage.setItem('acesstoken', String(data[0].access_token));
                    AsyncStorage.setItem('refreshtoken', String(data[0].refresh_token));
                    AsyncStorage.setItem('userid', String(data[0].userid));
                    AsyncStorage.setItem('usergroup',String(data[0].usergroup));
                    console.log(data[0].usergroup)
                    this.props.navigation.replace('Splash');

                }
                else {
                    console.log("Login failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={{height: 120}}>  Reifenmanagement 24 Stunden Rennen </Text>
                <View >
                    <Text >Username eingeben: </Text>
                    <TextInput
                        style={{height:60 }}
                        placeholder=" Username"
                        onChangeText={(username) => this.setState({username})}
                    />
                    <Text>Passwort eingeben: </Text>
                    <TextInput
                        style={{height: 60}}
                        secureTextEntry={true}
                        placeholder=" Password"
                        onChangeText={(password) => this.setState({password})}
                    />
                    <Button
                        disabled={!this.validateForm()}
                        title="Login"
                        onPress={this.handleSubmit}
                    />
                </View>
            </View>
        );
    }
}