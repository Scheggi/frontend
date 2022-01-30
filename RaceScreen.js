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


export default class RaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataRace: [],
            dataWeather:[],
            raceID :0,
            raceList:[]
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

     async getRaceID(event){
        AsyncStorage.setItem("raceID",event.target.value);
        const id = await AsyncStorage.getItem("raceID");
        console.log(id);
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
                title="Berechnung Reifendruck"
                onPress={this.changeAstrid}
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
                  title="Statistiken anzeigen"
                    onPress={this.changeMaen}
                />
                 <Text style={{height: 10}}> </Text>
                <Button
                    title="Formel Reifendruck anlegen"
                    onPress={this.changeNewFormel}
                />
                <Text style={{height: 10}}> </Text>
                <Button
                    title="Neues Mitglied anlegen"
                    onPress={this.changeNewUser}
                />
                 <Text style={{height: 10}}> </Text>
                <Button
                  title="Niklas"
                    onPress={this.changeNiklas}
                />
                </View>
                <View style={{width: 200}}>
                <Text style={{height: 40}}> </Text>
                <Button
                    title="Ausloggen"
                    onPress={this.changeLogout}
                />
                </View>
            </View>
        );
    }
}
