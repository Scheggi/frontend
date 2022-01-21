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
                    AsyncStorage.setItem('accesstoken', String(data[0].access_token));
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

                <Text style={styles.textStyles}>Reifenmanagement</Text>

                <View >

                    <Text style={{height: 50}}></Text>

                    <table>

                    <tbody>
                        <tr>
                            <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white'}}><label> Username eingeben: </label></td>
                            <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.type}
                            onChangeText={(username) => this.setState({username})} placeholder='Username'/></td>
                        </tr>
                    </tbody>

                    <tbody>
                        <tr>
                            <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white'}}><label> Passwort eingeben: </label></td>
                            <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.place}
                            secureTextEntry={true} onChangeText={(password) => this.setState({password})} placeholder='Passwort'/></td>
                        </tr>
                    </tbody>

                    </table>

                    <View style={{marginLeft: 'auto', marginRight: 'auto', width: 200}}>

                        <Text style={{height: 40}}></Text>
                        <Button disabled={!this.validateForm()} title="Login" onPress={this.handleSubmit}/>

                    </View>

                </View>
            </View>
        );
    }
}