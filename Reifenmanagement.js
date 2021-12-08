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
import {getRaceList, getWeatherTab, timeoutPromise,getWheelsList,getRaceDetails_by_ID} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";

export default class WheelScreen extends React.Component {
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


    

    render() {
        let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    24 Stunden Rennen
                </Text>

                

                <div>
                <h1 id='title'>Tabelle Wetter</h1>
                <table id='dataWeather'>
                   <tbody>
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

