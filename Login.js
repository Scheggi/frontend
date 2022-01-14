import React from "react";
import {TextInput, Button, View, ImageBackground} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise} from "./tools"
import Text from "react-native-web/dist/vendor/react-native/Animated/components/AnimatedText";
 // import image from './images/audi.jpg';

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

 // <ImageBackground source={image} resizeMode="cover" style={images}> </ImageBackground>

    render() {
        return (
            <View style={{overflowY: 'scroll', flex: 1, backgroundColor: '#2e3742'}}>
            <div className='container' style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <br/>
                    <br/>
                    <br/>
                    <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}}> Reifenmanagement</h1>
                    <br/>
                </div>
                <br/>
                <div className='input-group' style={{width: 400, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Usernamen eingeben: </label>
                    <input type='text' className='form-control' aria-label='Server' value={this.state.type}
                            onChange={(username) => this.setState({username: username.target.value})} placeholder='Username'/>
                </div>
                <br/>
                <div className='input-group' style={{width: 400, marginLeft: 'auto', marginRight: 'auto'}}>
                    <label className='input-group-text' style={{backgroundColor: '#d0d7de'}}> Passwort eingeben: </label>
                    <input type='password' className='form-control' aria-label='Server' value={this.state.place}
                            secureTextEntry={true} onChange={(password) => this.setState({password:password.target.value})} placeholder='Passwort'/>
                </div>
                <br/>
                <br/>
                <button disabled={!this.validateForm()} type='button' className='btn btn-primary'
                        onClick={this.handleSubmit} style={{marginLeft: 'auto', marginRight: 'auto'}}> EINLOGGEN
                </button>
            </View>

        );
    }
}
