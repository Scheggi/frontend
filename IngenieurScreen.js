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

export default class IngenieurScreen extends React.Component {
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
    changeMain = event => {
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


    //Tabular Weather Data
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


    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    24 Stunden Rennen
                </Text>

                <ScrollView style={styles.containerChild2}>
                     <Table list={this.state.dataWeather}/>
                </ScrollView>

                <Button
                    title="zurück"
                    onPress={this.changeMain}
                />
            </View>
        );
    }
}

