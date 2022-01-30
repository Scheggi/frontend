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

import {getRaceList, timeoutPromise, getWeatherTab} from "./tools";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import {getWheelSetInformation} from "./tools_get_wheels"
import { logToConsole } from "react-native/Libraries/Utilities/RCTLog";


export default class RaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            dataWeather:[],
            raceID : false,
            raceList:[],

            ReturnedWheelInformations:[],

            timeWeather: 0,
            timeOrder: 0,
            timeHeating: 0,

            timeWeatherG: '00:00:00',
            timeOrderG: '00:00:00',
            timeHeatingG: '00:00:00',
        }

        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    startTimer() {
        if (this.timer == 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        let secondsWeather = this.state.timeWeather-1;
        let secondsOrder = this.state.timeOrder-1;
        let secondsHeating = this.state.timeHeating-1;

        if(secondsWeather < 0) {secondsWeather+=1}
        if(secondsOrder < 0) {secondsOrder+=1}
        if(secondsHeating < 0) {secondsHeating+=1}

        this.setState({

            timeWeather: secondsWeather,
            timeWeatherG: this.secondsToTime(secondsWeather),
            timeOrder: secondsOrder,
            timeOrderG: this.secondsToTime(secondsOrder),
            timeHeating: secondsHeating,
            timeHeatingG: this.secondsToTime(secondsHeating),

            });
    }

    secondsToTime(secs){

        if(secs <= 0) {return '00:00:00'}

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

    compute_Order_Heating_TimerSeconds(tmp, duration) {
        let tmpInSeconds = (new Date(Date.parse(tmp)).getTime() / 1000)
        let nowDate = (new Date().getTime() / 1000)
        let result = Math.floor(tmpInSeconds - nowDate)

        if(result <= 0) {return 0}
        return Math.floor(tmpInSeconds - nowDate)
    }

    getSecondsToNextMeasurement(ttemp) {

        if(ttemp == null) {
            return;
        }

        let lastDate = (new Date(Date.parse(ttemp.datetime)).getTime() / 1000)
        let nowDate = (new Date().getTime() / 1000)
        let result = 1800 - Math.floor(nowDate - lastDate)

        if(result > 0) {
            this.setState({timeWeather: result})
        }
    }

    async getWeatherData(raceID){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                this.setState({dataWeather: DataTabular});
                this.getSecondsToNextMeasurement(this.state.dataWeather[this.state.dataWeather.length-1])

            }).catch(function (error) {
                console.log(error);
            })
    }

    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
            this.setState({raceList: racelistDropdown});
            this.setState({raceID: this.state.raceList[0].id})

            if(this.state.raceID != false) {
                this.getWeatherData(this.state.raceID)
                this.getWheelSetInformation(this.state.raceID)
                this.startTimer()
            }

        }).catch(function (error) {
            console.log(error);
        })

    }

    async getWheelSetInformation(raceID){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
       getWheelSetInformation(accesstoken, raceID).then(DataTabular => {
            this.setState({ReturnedWheelInformations: DataTabular});
        

            var orderStart;
            var orderDuration;
            var heatStart;
            var heatDuration;

            Object.keys(DataTabular).forEach((key) => {
                if(key = 'order_start') {orderStart = DataTabular[key]}
                if(key = 'order_duration') {orderDuration = DataTabular[key]}
                if(key = 'heat_start') {heatStart = DataTabular[key]}
                if(key = 'heat_duration') {heatDuration = DataTabular[key]}
            });

            //heatStart = '27 Jan 2022 20:40:56 GMT'
            //heatDuration = 1800

            //orderStart = '27 Jan 2022 20:37:46 GMT'
            //orderDuration = 1800

            if(orderStart != null && orderDuration != null) {
                this.setState({
                    timeOrder: this.compute_Order_Heating_TimerSeconds(orderStart, orderDuration)
                });
            }

            if(heatStart != null && heatDuration != null) {
                this.setState({
                    timeHeating: this.compute_Order_Heating_TimerSeconds(heatStart, heatDuration)
                });
            }

        }).catch(function (error) {
            console.log(error);
        })
    }

    changeLogout = event => {
        event.preventDefault();
        this.props.navigation.replace('Logout');
    }

    changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace');
    }

     changeNewUser = event => {
        event.preventDefault();
        this.props.navigation.push('NewUser');
    }

     changeFormel = event => {
        event.preventDefault();
        this.props.navigation.push('Formel');
    }

    changeNewOrder = event => {
        event.preventDefault();
        this.props.navigation.push('NewOrder');
    }


    changeWeather = event => {
        event.preventDefault();
        this.props.navigation.push('Weather');
    }

    changeShowRace = event => {
        event.preventDefault();
        this.props.navigation.push('ShowRace');
    }

     changeWheel = event => {
        event.preventDefault();
        this.props.navigation.push('Wheel');
    }

    changeNewFormel = event => {
        event.preventDefault();
        this.props.navigation.push('NewFormel');
    }

    changeAstrid = event => {
        event.preventDefault();
        this.props.navigation.push('Astrid');
    }

    changeNiklas = event => {
        event.preventDefault();
        this.props.navigation.push('Niklas');
    }

    changeMaen = event => {
        event.preventDefault();
        this.props.navigation.push('Maen');
    }

    async saveRaceIDinState() {
        const id = await AsyncStorage.getItem("raceID");

        clearInterval(this.timer);
        this.timer = 0;

        this.setState({

            timeWeather: 0,
            timeWeatherG: '00:00:00',
            timeHeating: 0,
            timeHeatingG: '00:00:00',
            timeOrder: 0,
            timeOrderG: '00:00:00',

        });

        this.setState({raceID: id});
        this.getWeatherData(id);
        this.getWheelSetInformation(id);
        this.startTimer();
    }

    getRaceID = event => {
        const id = event.target.value;
        AsyncStorage.setItem("raceID",event.target.value);
        this.saveRaceIDinState();
    }

    render() {
        let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));

    const styles = StyleSheet.create ({
        mainContainer: {
            flex: 1,
            flexDirection: 'row',
        },

        timerContainer: {
            alignItems: 'center',
            width: '30%',
            height: '100%',
        },

        textStyle: {
            margin: 10,
            fontFamily: 'arial',
            fontSize: 25,
        },

        buttonContainer: {
            flex: 0.7,
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'arial',
        },
    });

        return (
            <View style={styles.mainContainer}>
                <View style={styles.timerContainer}>
                <Text style={styles.textStyle}>Wetterdaten messen:</Text>
                <Text style={styles.textStyle}>{this.state.timeWeatherG}</Text>
                <Text style={styles.textStyle}>Felgen werden noch geheizt für:</Text>
                <Text style={styles.textStyle}>{this.state.timeHeatingG}</Text>
                <Text style={styles.textStyle}>Reifen zur Abholung bereit in:</Text>
                <Text style={styles.textStyle}>{this.state.timeOrderG}</Text>
                </View>

                <View style={styles.buttonContainer}>
                <Text style={{fontSize: 30, fontWeight: 30}}>Reifenmanagement</Text>
                <Text style={{height: 30}}> </Text>
                <label style={{fontSize: 16}}> Rennen auswählen: <select value={this.state.id} onChange={this.getRaceID}>
                  {optionTemplate}
                </select>
                </label>

                <View style={{width: 300}}>
                  <Text style={{height: 20}}> </Text>
                <Button
                    title="Neue Renndaten anlegen"
                    onPress={this.changeNewRace}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                  title="Renndaten anzeigen"
                    onPress={this.changeShowRace}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Reifenbestellungen verwalten"
                    onPress={this.changeNewOrder}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Reifendetails anzeigen"
                    onPress={this.changeWheel}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Wetterdaten anzeigen"
                    onPress={this.changeWeather}
                />
                 <Text style={{height: 10}}> </Text>
                <Button
                    title="Formel Reifendruck anlegen"
                    onPress={this.changeFormel}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Neues Mitglied anlegen"
                    onPress={this.changeNewUser}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Neue Formel anlegen"
                    onPress={this.changeNewFormel}
                />
                 <Text style={{height: 10}}> </Text>
                <Button
                title="Astrid anzeigen"
                onPress={this.changeAstrid}
                />
                 <Text style={{height: 10}}> </Text>
                <Button
                  title="Niklas"
                    onPress={this.changeNiklas}
                />
                 <Text style={{height: 10}}> </Text>
                <Button
                  title="Maen anzeigen"
                    onPress={this.changeMaen}
                />
                </View>
                <View style={{width: 200}}>
                <Text style={{height: 40}}> </Text>
                <Button
                    title="Logout"
                    onPress={this.changeLogout}
                />
                </View>
                </View>
            </View>
        );
    }
}
