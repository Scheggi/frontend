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
        const accesstoken = await AsyncStorage.getItem('acesstoken');
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
        this.props.navigation.push('Ingenieur');
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
        AsyncStorage.setItem("raceID",event.target.value);
        this.saveRaceIDinState();
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


                <Text >

                </Text>



                <Button
                    title="Screen Formel"
                    onPress={this.changeFormel}
                />

                <Text >

                </Text>

                <Button
                    disabled={!this.validateForm()}
                    title="Screen Übersicht"
                    onPress={this.changeIngenieur}
                />

                <Button
                    title="Logout"
                    onPress={this.changeLogout}
                />

            </View>
        );
    }
}

