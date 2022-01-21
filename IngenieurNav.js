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
import {getRaceList, timeoutPromise} from "./tools"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";

export default class IngenieurNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            dataWeather:[],
            raceID : 0,
            raceList:[],
        }
    }

    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({raceList: racelistDropdown});
        }).catch(function (error) {
            console.log(error);
        })

    }

    changeLogout = event => {
        event.preventDefault();
        this.props.navigation.push('Logout');
    }


     changeFormel = event => {
        event.preventDefault();
        this.props.navigation.push('Formel');
    }

    changeIngenieur = event => {
        event.preventDefault();
        this.props.navigation.push('Wetter');
    }

    changeWheel = event => {
        event.preventDefault();
        this.props.navigation.push('Wheel');
    }



    validateForm(){
        return this.state.raceID != 0;
    }


    async saveRaceIDinState(){
        const id = await AsyncStorage.getItem("raceID");
        this.setState({raceID : id} );
        console.log(this.state.raceID);
    }

     getRaceID = event =>{
        const id = event.target.value;
        AsyncStorage.setItem("raceID",id);
        this.saveRaceIDinState();
    }




    render() {
        let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));
        return (
             <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    Reifenmanagement
                </Text>
                <Text style={{height: 30}}> </Text>
                <label style={{fontSize: 16}}> Rennen auswählen: <select value={this.state.id} onChange={this.getRaceID}>
                  {optionTemplate}
                </select>
                </label>
                <View style={{width: 300}}>
                  <Text style={{height: 20}}> </Text>
                 <Button
                    title="Formel Reifendruck anlegen"
                    onPress={this.changeFormel}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Wetterdaten anzeigen"
                    onPress={this.changeIngenieur}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Reifendetails anzeigen"
                    onPress={this.changeWheel}
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
        );
    }
}
