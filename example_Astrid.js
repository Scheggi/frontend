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

    changeMain = event => {
        event.preventDefault();
        this.props.navigation.replace('Main');
    }


     async getRaceID(event){
        AsyncStorage.setItem("raceID_Example",event.target.value);
        const id = await AsyncStorage.getItem("raceID_Example");
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

                <label>
                Wähle das gewünschte Rennen aus:
                <select value={this.state.id} onChange={this.getRaceID}>
                  {optionTemplate}
                </select>
                </label>


                <Button
                    title="Hauptmenue"
                    onPress={this.changeMain}
                />



            </View>
        );
    }
}

