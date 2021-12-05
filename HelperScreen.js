
import React from "react";
import {
    View,
    Text,
    StyleSheet,
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
import {styles} from "./styles"
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


    async getRaceID(event){
        AsyncStorage.setItem("raceID",event.target.value);
        const id = await AsyncStorage.getItem("raceID");
        console.log(id);
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
        })

        const accesstoken = await AsyncStorage.getItem('acesstoken');
        getWeatherTab(accesstoken).then(DataTabular => {
            console.log(DataTabular);
            this.setState({dataWeather: DataTabular});
        }).catch(function (error) {
            console.log(error);
        })

    }


    /*
    async componentDidMountWeather() {
      const accesstoken = await AsyncStorage.getItem('acesstoken');
      const raceID = await AsyncStorage.getItem('raceID');
      timeoutPromise(2000, fetch("https://api.race24.cloud/user/weather/getlast10", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              access_token: accesstoken,
              raceID: raceID
          })
          })).then(response => response.json()).then(data => {
              console.log(data);
              this.setState({dataWeather: data[0].data})
          })
    }



    async componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
      //Implementiere Get Available Races
      const accesstoken = await AsyncStorage.getItem('acesstoken');
      timeoutPromise(2000, fetch("https://api.race24.cloud/user/race/get", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              access_token: accesstoken,
          })
          })).then(response => response.json()).then(data => {
              console.log(data);
              this.setState({dataRace: data[0].data})
          })
    }

     */


    validateForm() {
        return this.state.id > 0 ;
    }
    handleSubmit = event => {
        event.preventDefault();
        const id = AsyncStorage.getItem("raceID")
        this.sendNewWeatherRequest(id, this.state.temp_air,this.state.temp_ground,
            this.state.weather_des);
    }

    async sendNewWeatherRequest(id,temp_air,temp_ground,weather_des) {
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/weather/create/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raceID: AsyncStorage.getItem("raceID"),
                    temp_air:temp_air,
                    temp_ground:temp_ground,
                    datetime: this.getTime(),
                    weather_des:weather_des,
                })
            })
            ).then(response => response.json()).then(
                //timer von 30 min neu startem
                ).catch(function (error) {
                console.log(error);
            })
    }


    render() {
        let optionTemplate = this.state.dataRace.map(v => (
            <option value={v.id}>{v.name}</option>
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

                //tabular weather


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
                </View>

            </View>
        );
    }
}
