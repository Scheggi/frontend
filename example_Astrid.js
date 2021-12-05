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
import {getRaceList, getWeatherTab, timeoutPromise} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";

export default class AstridScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            raceID :0,
            raceList:[],
            dataWeather: [],
        }
    }

    //get RaceList
    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({raceList: racelistDropdown});
        }).catch(function (error) {
            console.log(error);
        })
    }

    // navigate to Main Menue
    changeMain = event => {
        event.preventDefault();
        this.props.navigation.replace('Race');
    }

    // save RaceID to AsyncStorage, with AsyncStorage.getItem("raceID_Example") you get this ID
    // afterwards get WeatherData of this Race and
    //WeatherData is now in this.state.dataWeather
     getRaceID = event =>{
        console.log(event.target)
        AsyncStorage.setItem("raceID_Example",event.target.value);
        //const id = await AsyncStorage.getItem("raceID_Example");
        console.log(event.target.value);
        this.getWeatherData(event.target.value);
    }

    //get Weather Data, it will be used in getRaceID
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

