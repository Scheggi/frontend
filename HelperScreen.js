import React from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableHighlight,
    SectionList,
    TouchableOpacity
} from 'react-native';
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from "react-native-web";
//import {Button, Text, TextInput, ToastAndroid, View} from "react-native";

import {timeoutPromise,getWeatherTab, refreshToken,getRaceList} from "./tools";

export default class NewHelpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temp_ground: 0.0,
            temp_air: 0.0,
            weather_des: "",
            datetime: "",
            raceList: [],
            dataWeather: [],
            time: {},
            seconds: 1800,
        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        let obj = {
          "h": hours,
          "m": minutes,
          "s": seconds
        };
        return obj;
    }

    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
            }
    }
    countDown() {
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
            });
        // Check if  zero.
      if (seconds == 0) {
          clearInterval(this.timer);
          }
      }

    getTime(){
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes() ;
        return h+":"+m;
    }


    getRaceID = event =>{
        AsyncStorage.setItem("raceID",event.target.value);
        this.getWeatherData(event.target.value);
    }

    async getWeatherData(raceID){
       const accesstoken = await AsyncStorage.getItem('acesstoken');
       //const raceID = await AsyncStorage.getItem('raceID');
       console.log(raceID)
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                console.log(DataTabular);
                this.setState({dataWeather: DataTabular});
            }).catch(function (error) {
                console.log(error);
            })
    }

    async componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({raceList: racelistDropdown});
        }).catch(function (error) {
            console.log(error);
        });
        }


    changeLogout = event => {
        event.preventDefault();
        this.props.navigation.replace('Logout');
    }


    validateForm() {
        return this.weather_des.length > 0 ;
    }
    handleSubmit = event => {
        event.preventDefault();
        const id = AsyncStorage.getItem("raceID")
        this.sendNewWeatherRequest(id, this.state.temp_air,this.state.temp_ground,
            this.state.weather_des);
    }

    async sendNewWeatherRequest(temp_air,temp_ground,weather_des) {
        const id = await AsyncStorage.getItem("raceID");
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/weather/create/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raceID:id,
                    temp_air: parseFloat(temp_air),
                    temp_ground: parseFloat(temp_ground),
                    datetime: this.getTime(),
                    weather_des:weather_des,
                })
            })
            ).then(response => response.json()).then(
                console.log("success")
                ).catch(function (error) {
                console.log(error);
            })
    }


    render() {
        let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
    ));
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    24 Stunden Rennen
                </Text>
                <label>
                Wähle das gewünschte Rennen aus:
                <select value={this.state.id} onChange={this.getRaceID}>
                  {optionTemplate}
                </select>
                </label>

                <div>
                    <button onClick={this.startTimer}>Start</button>
                    m: {this.state.time.m} s: {this.state.time.s}
                 </div>



                <View >
                    <Text >Temperatur des Bodens angeben: </Text>
                    <TextInput
                        style={{height:60 }}
                        placeholder=" xx.xxxx"
                        onChangeText={(text) => this.setState({ temp_ground:parseFloat(text.trim())})}
                    />
                    <Text>Temperatur der Luft angeben: </Text>
                    <TextInput
                        style={{height: 60}}
                        placeholder=" xx.xxxx"
                        onChangeText={(text) => this.setState({temp_air:parseFloat(text.trim())})}
                    />
                    <Text> Wetter Beschreibung angeben: </Text>
                    <TextInput
                        style={{height: 60}}
                        placeholder=" bewoelkt"
                        onChangeText={(text) => this.setState({weather_des:text})}
                    />
                    <Button
                        disabled={!this.validateForm()}
                        title="Neues Datenset anlegen"
                        onPress={this.handleSubmit}
                    />

                    <Button
                    title="Logout"
                    onPress={this.changeLogout}
                    />

                </View>

            </View>
        );
    }
}
