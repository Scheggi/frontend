import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData} from "./tools";

export default class NewRaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            place: '',
            date: '',
        }
    }


    validateForm() {
        return this.state.date.length > 0 && this.state.place.length >0;
    }
    handleSubmit = event => {
        event.preventDefault();
        this.sendNewRaceRequest(this.state.type,this.state.place,this.state.date);
    }
    async sendNewRaceRequest(type,place,date) {
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/race/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type:type,
                    place:place,
                    date:date,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("changeNav")
                    this.props.navigation.replace("Race");//replace('Race');
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
                    24 Stunden Rennen
                </Text>
                 <Text style={{height:60}}>
                    Neues Rennen anlegen
                </Text>
                <View >
                    <Text >Ersten Tag des Rennen angeben im Format DD.MM.YYYY: </Text>
                    <TextInput
                        style={{height:50 }}
                        placeholder=" DD.MM.YYYY"
                        onChangeText={(text) => this.setState({date:text,})}
                    />
                    <Text>Ort angeben: </Text>
                    <TextInput
                        style={{height: 50}}
                        placeholder=" Ort"
                        onChangeText={(place) => this.setState({place:place})}
                    />
                    <Text> Art des Rennens angeben: </Text>
                    <TextInput
                        style={{height: 50}}
                        placeholder=" 24 Stunden Rennen"
                        onChangeText={(type) => this.setState({type:type})}
                    />
                    <Button
                        disabled={!this.validateForm()}
                        title="Rennen anlegen"
                        onPress={this.handleSubmit}
                    />
                </View>

            </View>
        );
    }
}
