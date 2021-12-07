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
            startdate: '',
            enddate: '',
            starttime: '',
            endtime: ''
        }
    }

    validateForm() {
        return this.state.startdate.length > 0 ;
    }
    handleSubmit = event => {
        event.preventDefault();
        this.sendNewRaceRequest(this.state.type,this.state.place,this.state.startdate, this.state.enddate, this.state.starttime, this.state.endtime);
    }
    async sendNewRaceRequest(type,place,startdate,enddate,starttime,endtime) {
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
                    startdate:date,
                    enddate:date,
                    starttime:time,
                    endtime:time
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    this.props.navigation.replace('MainNav');
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
            <View style={{flex: 0.9, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                <View>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}>
                        24h-Rennen
                    </Text>
                    <Text style={{fontSize: 20, height: 60}}>
                        Neues Rennen anlegen
                    </Text>
                </View>
                <table>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white'}}><label> Rennart: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><input value={this.state.type}
                                   onChangeText={(type) => this.set.State({type:type})} placeholder='24h-Rennen'/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white'}}><label> Rennstrecke: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <input value={this.state.place}
                                    onChangeText={(place) => this.set.State({place: place})} placeholder='Rennstrecke'/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white'}}><label> Startdatum: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><input value={this.state.startdate}
                                   onChangeText={(date) => this.set.State({startdate: date})} placeholder='TT.MM.JJJJ'/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white'}}><label> Enddatum: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><input value={this.state.enddate}
                                   onChangeText={(date) => this.set.State({enddate: date})} placeholder='TT.MM.JJJJ'/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white'}}><label> Startzeit: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><input value={this.state.starttime}
                                   onChangeText={(time) => this.set.State({starttime: time()})} placeholder='SS:MM'/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white'}}><label> Endzeit: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <input value={this.state.endtime}
                                   onChangeText={(time) => this.set.State({endtime: time()})} placeholder='SS:MM'/></td>
                    </tr>
                </table>
                <View>
                    <Text style={{height: 40, backgroundColor: 'white'}}> </Text>
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


