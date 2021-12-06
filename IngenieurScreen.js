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
import {getRaceList, getWeatherTab, timeoutPromise,TableNiklas} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";

export default class IngenieurScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            raceID :0,
            raceList:[],
            dataWeather: [],
            list_formel:[],
            formel:"",

        }
    }

    //get RaceList
    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const raceID = await AsyncStorage.getItem("raceIDIngenieur");
        getWeatherTab(accesstoken, raceID).then(DataTabular => {
                console.log(DataTabular);
                this.setState({dataWeather: DataTabular});
                AsyncStorage.setItem("WeatherList",DataTabular);
            }).catch(function (error) {
                console.log(error);
            })
    }

    // navigate to Main Menue
    changeMain = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }


    async renderTableHeader() {
        let weatherList = await AsyncStorage.getItem("WeatherList")
        await weatherList!=null;
        if (weatherList !=null){
        console.log(weatherList)
        let header = Object.keys(weatherList)
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
      })}
        else{
            return [];
        }
   }

    //Tabular Weather Data
    async renderTableData() {
        let weatherList = await AsyncStorage.getItem("WeatherList")
        if (weatherList != null){
        return weatherList.map((dataWeather, index) => {
            const {datetime,temp_ground,temp_air,weather_des} = singledata
            return (
            <tr key={datetime}>
               <td>{datetime}</td>
               <td>{temp_ground}</td>
                <td>{temp_air}</td>
                <td>{weather_des}</td>
            </tr>
         )
      })}

   }


    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    24 Stunden Rennen
                </Text>


                <Text>
                    Test
                </Text>


                <div>
                <h1 id='title'>Tabelle Wetter</h1>
                <table id='dataWeather'>
                   <tbody>
                       <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
                   </tbody>
                </table>
                </div>

                <Button
                    title="zurück"
                    onPress={this.changeMain}
                />

            </View>
        );
    }
}

