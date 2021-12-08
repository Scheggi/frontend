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

        changeRace = event => {
        event.preventDefault();
        this.props.navigation.replace('Race');
    }

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
                    <Text style={{height: 30}}> </Text>
                    <form >
                        <label style={{fontSize: 16}}>
                          Gruppe:
                          <select group={this.state.group} onChange={(text) => this.setState({group:text.target.value})}>
                            <option group="Helfer">Helfer</option>
                            <option group="Manager">Manager</option>
                            <option group="Ingenieur">Ingenieur</option>
                          </select>
                        </label>
                    </form>
                    <Text style={{height: 20}}> </Text>
                    <table>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white'}}><label> Vorname: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.type}
                                   placeholder="Vorname" onChangeText={(text) => this.setState({firstname:text.trim()})}/></td>
                    </tr>
                     <tr style={{height: 20}}> </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white'}}><label> Nachname: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.place}
                                    placeholder=" Nachname" onChangeText={(text) => this.setState({lastname:text.trim()})}/>
                        </td>
                    </tr>
                           <tr style={{height: 20}}> </tr>
                         <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white'}}><label> Username: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.type}
                                   placeholder="Username" onChangeText={(text) => this.setState({username:text.trim()})}/></td>
                    </tr>
                     <tr style={{height: 20}}> </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white'}}><label> Passwort: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.place}
                                    secureTextEntry={true} placeholder="Passwort" onChangeText={(text) => this.setState({password:text})}/>
                        </td>
                    </tr>
                    </table>
                    <Text style={{height: 40}}> </Text>
                    <Button
                        disabled={!this.validateForm()}
                        title="neues Mitglied anlegen"
                        onPress={this.handleSubmit}
                    />
                    <Text> </Text>
                        <Button
                            title="zurück"
                            onPress={this.changeRace}
                            />
                </View>

            </View>
        );
    }

}