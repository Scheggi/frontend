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
        this.props.navigation.replace('NewRace');
    }

     changeNewUser = event => {
        event.preventDefault();
        this.props.navigation.replace('NewUser');
    }

     changeFormel = event => {
        event.preventDefault();
        this.props.navigation.replace('Formel');
    }

    changeNewOrder = event => {
        event.preventDefault();
        this.props.navigation.replace('NewOrder');
    }


     changeAstrid = event => {
        event.preventDefault();
        this.props.navigation.replace('Astrid');
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
                    24 Stunden Rennen
                </Text>

                <Button
                    title="Neues Rennen anlegen"
                    onPress={this.changeNewRace}
                />

                <Text >
                </Text>

                <Button
                    title="Neues Mitglied anlegen"
                    onPress={this.changeNewUser}
                />

                <Text >
                </Text>

                <Button
                    title="Screen Formel"
                    onPress={this.changeFormel}
                />

                <Text >
                </Text>

                <Button
                    title="Neue Reifenbestellung anlegen"
                    onPress={this.changeNewOrder}
                />

                <Text >
                </Text>

                <Button
                    title="Screen Astrid"
                    onPress={this.changeAstrid}
                />


                <label>
                Wähle das gewünschte Rennen aus:
                <select value={this.state.id} onChange={this.getRaceID}>
                  {optionTemplate}
                </select>

                </label>

                <Button
                    title="Logout"
                    onPress={this.changeLogout}
                />



            </View>
        );
    }
}

