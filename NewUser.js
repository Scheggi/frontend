import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData} from "./tools";

export default class NewUserScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firsname: '',
            lastname: '',
            username: '',
            password: '',
            group: 'Helper',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) { this.setState({group: event.target.group});  }
    handleSubmitDrop(event) {
        alert('group is: ' + this.state.group);
    event.preventDefault();
    }

    /*
    getRaceId(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd+mm+yyyy;
        this.state.date = dd+"."+mm+"."+yy;
        this.state.id = parseInt(today);
    }
    */

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0  ;
    }
    handleSubmit(event){
        event.preventDefault();
        this.sendNewRaceRequest(this.state.username, this.state.firstname,this.state.lastname,
            this.state.password,this.state.group);
    }
    async sendNewRaceRequest(username,firstname,lastname,password,group) {
        console.log(group);
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/user/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    first_name: firstname,
                    last_name:lastname,
                    password:password,
                    group:group,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log(data[0])
                    this.props.navigation.replace('Race');
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }


    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    Neues Mitglied anlegen
                </Text>

                <View >
                    <Text >Vorname </Text>
                    <TextInput
                        style={{height:60 }}
                        placeholder="Vorname"
                        onChangeText={(text) => this.setState({firstname:text.trim()})}
                    />
                    <Text>Nachname: </Text>
                    <TextInput
                        style={{height: 60}}
                        placeholder=" Nachname"
                        onChangeText={(text) => this.setState({lastname:text.trim()})}
                    />
                    <Text> Username : </Text>
                    <TextInput
                        style={{height: 60}}
                        placeholder=" username"
                        onChangeText={(text) => this.setState({username:text.trim()})}
                    />
                    <Text> Passwort : </Text>
                    <TextInput
                        style={{height: 60}}
                        secureTextEntry={true}
                        placeholder=" Passwort"
                        onChangeText={(text) => this.setState({password:text})}
                    />
                    <form >
                        <label>
                          Ordne dem Mitglied eine Gruppe zu:
                          <select group={this.state.group} onChange={(text) => this.setState({group:text.target.value})}>
                            <option group="Helfer">Helfer</option>
                            <option group="Manager">Manager</option>
                            <option group="Ingenieur">Ingenieur</option>
                          </select>
                        </label>
                    </form>

                    <Button
                        disabled={!this.validateForm()}
                        title="neues Mitglied anlegen"
                        onPress={this.handleSubmit}
                    />
                    
                    
                </View>

            </View>
        );
    }
}
