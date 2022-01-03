import React from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableHighlight,
    SectionList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from "react-native-web";
//import {Button, Text, TextInput, ToastAndroid, View} from "react-native";

import {timeoutPromise,getWeatherTab, refreshToken,getRaceList} from "./tools";
import Table from "./Table";

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
      time: '',
      seconds: 0,
      raceid:0,
      lastStemp: '',
    }

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

  }

  getSecondsToNextMeasurement(ttemp) {

    let lastDate = (new Date(Date.parse(ttemp.datetime)).getTime() / 1000)
    let nowDate = (new Date().getTime() / 1000)
    let result = 1800 - Math.floor(nowDate - lastDate)

    if(result <= 0) {
      this.setState({time: 'Jetzt fällig!'})
      clearInterval(this.timer)
    }else {
      this.setState({seconds: result})
      this.startTimer()
    }
  }

    secondsToTime(secs){

        let hours = Math.floor(secs / (60 * 60));
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        if(hours.toString().length == 1) {hours = `0${hours}`}
        if(minutes.toString().length == 1) {minutes = `0${minutes}`}
        if(seconds.toString().length == 1) {seconds = `0${seconds}`}

        let obj = `${hours}:${minutes}:${seconds}`;
        return obj 

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
      if (seconds == 0) {
          clearInterval(this.timer);
        }
    }

    async saveRaceIDinState(){
        const id = await AsyncStorage.getItem("raceIDHelper");
        this.setState({raceid : id} );
        this.getWeatherData(id);
    }

     getRaceID = event =>{
        const id = event.target.value;
        AsyncStorage.setItem("raceIDHelper",event.target.value);
        this.saveRaceIDinState();
    }


    async getWeatherData(raceID){
       const accesstoken = await AsyncStorage.getItem('acesstoken');
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                this.setState({dataWeather: DataTabular});
                this.setState({lastStemp: this.state.dataWeather[this.state.dataWeather.length-1]})
                if(this.state.lastStemp != null) {
                  this.getSecondsToNextMeasurement(this.state.lastStemp)
                }else {
                  clearInterval(this.timer)
                  this.timer = 0;
                  this.setState({time: '00:00:00'})
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    async componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeLeftVar });
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
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
        return this.state.weather_des.length > 0 && this.state.raceid != 0 ;
    }
    handleSubmit = event => {
        event.preventDefault();
        this.sendNewWeatherRequest(this.state.temp_air,this.state.temp_ground,
            this.state.weather_des);
    }


    async sendNewWeatherRequest(temp_air,temp_ground,weather_des) {
      const id = await AsyncStorage.getItem("raceIDHelper");
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/user/weather/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raceID:id,
                    temp_air: parseFloat(temp_air),
                    temp_ground: parseFloat(temp_ground),
                    weather_des: weather_des,
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

        console.log(this.state.time)

    window.addEventListener('load', function() {
        setTimeout(function()
        {
            let select = document.getElementById('option');
            select.options.selectedIndex = 0;
            select.dispatchEvent(new Event('change', {bubbles: true}));
        }, 1000); // TODO - MÖGLICHST AUF DIESE UMSETZUNGSWEISE VERZICHTEN
    })

    const styles = {

        container: {
        flex: 1,
        flexDirection: 'row',
            justifyContent: 'space-around'
        },

        containerChild1: {
        alignItems: 'center',
        backgroundColor: 'grey',
        width: 350,
        },

        containerChild2: {
        textAlign: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    };

        return (
          <View style={styles.container}>

            <View style={styles.containerChild1}>

              <Text style={{fontSize: 30, color:'white', fontWeight: 'bold', marginBottom: 30, marginTop: 30, fontfamily: 'arial'}}>Wetterdaten</Text>

              <label style={{textAlign: 'center', fontFamily: 'arial', color: 'white'}}>Rennen:
              <select id='option' style={{margin: 10, fontFamily: 'arial'}} value={this.state.id} onChange={this.getRaceID}>{optionTemplate}</select>
              </label>

              <label style={{margin:20,textAlign:'center',fontFamily:'arial',color:'white'}}>Nächste Messung: {this.state.time}</label>

              <label style={{color: 'white',  fontFamily: 'arial'}}>Lufttemperatur</label>
              <TextInput
              style = {{backgroundColor: 'white', borderRadius: 10, width: 200, height: 40, margin: 15, textAlign: 'center'}}
              placeholder="xx.xx"
              onChangeText={(text) => this.setState({temp_air:parseFloat(text.trim())})}
              />
                 <Text> </Text>
              <label style={{color: 'white',  fontFamily: 'arial'}}>Streckentemperatur</label>
              <TextInput
              style = {{backgroundColor: 'white', borderRadius: 10, width: 200, height: 40, margin: 15, textAlign: 'center'}}
              placeholder="xx.xx"
              onChangeText={(text) => this.setState( {temp_ground:parseFloat(text.trim())})}
              />
                <Text> </Text>
              <label style={{color: 'white',  fontFamily: 'arial'}}>Streckenverhältnis</label>
              <TextInput
              style = {{backgroundColor: 'white', borderRadius: 10, width: 200, height: 40, marginBottom: 35, margin: 15, textAlign: 'center'}}
              placeholder="nass/trocken/bewölkt"
              onChangeText={(text) => this.setState({weather_des:text})}
              />
                <View style={{width: 200}}>
                    <Text> </Text>

              <Button
              title="Daten abspeichern"
              disabled={!this.validateForm()}
              onPress={this.handleSubmit}
              />

                <Text> </Text>
                 <Text> </Text>
             <Button
                title='Logout'
                onPress={this.changeLogout}
                />
                </View>
            </View>

            <ScrollView style={styles.containerChild2}>

              <Table list={this.state.dataWeather}/>

            </ScrollView>

          </View>
        );
    }
}