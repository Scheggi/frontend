import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    SectionList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {styles} from "./styles"
import {getRaceList, getWeatherTab, timeoutPromise,getWheelsList,getRaceDetails_by_ID} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import Table from "./Table";

export default class WeatherScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            raceID :0,
            raceList:[],
            dataWeather: [],
            listWheelStart:[],
            RaceDetails:[],
        }
    }

    // navigate to Main Menue
     changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    async componentDidMount(){
        this.getWeatherData();
    }


    //get RaceDetails by RaceID
    async getRaceDetails(){
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        getRaceDetails_by_ID(accesstoken,raceID).then(liste => {
            console.log(liste);
            this.setState({RaceDetails: liste});
        }).catch(function (error) {
            console.log(error);
        })
    }

    //get ReifenData
    async getWheelsStart(){
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        getWheelsList(accesstoken,raceID).then(liste => {
            console.log(liste);
            this.setState({listWheelStart: liste});
        }).catch(function (error) {
            console.log(error);
        })
    }


    //get Weather Data, it will be used in getRaceID
    async getWeatherData(){
       const accesstoken = await AsyncStorage.getItem('acesstoken');
       const raceID = await AsyncStorage.getItem('raceID');
       //const raceID = await AsyncStorage.getItem('raceID');
       console.log(raceID)
       getWeatherTab(accesstoken, raceID).then(DataTabular => {
                console.log(DataTabular);
                this.setState({dataWeather: DataTabular});
            }).catch(function (error) {
                console.log(error);
            })
    }


    /*
    renderTableData() {
        console.log(this.state.dataWeather)
        return this.state.dataWeather.map((dataWeather, index) => {
            const { temp_ground,temp_air,datetime,weather_des } =dataWeather //destructuring
            return (
            <tr key={datetime}>
               <td>{datetime}</td>
               <td>{temp_ground}</td>
                <td>{temp_air}</td>
                <td>{weather_des}</td>
            </tr>
         )
      })
   }
     */

    //Tabular Weather Data
    renderTableData() {
        console.log(this.state.dataWeather)
        return this.state.dataWeather.map((dataWeather, index) => {
            const { temp_ground,temp_air,datetime,weather_des } =dataWeather //destructuring
            return (
            <tr bgcolor='#d3d3d3' style={{textAlign: "left", padding: '8px', fontFamily: 'arial'}} key={temp_ground}>
               <td style={{border: "solid", borderColor: 'grey', height: 15, width: 150, padding: '8px'}} >{datetime}</td>
               <td style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >{temp_air}</td>
                <td style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >{temp_ground}</td>
                <td style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >{weather_des}</td>
            </tr>
         )
      })
   }

    render() {
        return (
            <View style={viewStyles1}>
                <div >
                <h1 style={{fontSize: 30, marginRight: 'auto', marginLeft: 'auto', textAlign: 'center'}} id='title'>Wetterdaten</h1>
                <table style={{overflowY: 'scroll'}} id='list_formel'>
                    <tr bgcolor='#808080' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}} >
                    <th style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}} >Zeitstempel</th>
                    <th style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >Lufttemperatur</th>
                    <th style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >Streckentemperatur</th>
                    <th style={{border: "solid", borderColor: 'grey', height: 20, width: 150, padding: '8px', textAlign: 'center'}} >Streckenverhältnis</th>
                    </tr>
                   <tbody>
                      {this.renderTableData()}
                   </tbody>
                </table>
                </div>
                <View  style={{width: 200}}>
                <Text style={{height: 20}}></Text>
                <Button
                        title="zurück"
                        onPress={this.changeRace}
                />
                    </View>
            </View>
        );
    }
}
const viewStyles1= {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'arial',
        overflowY: 'scroll',
    };
