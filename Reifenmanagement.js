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

    

    

    render() {

        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    24 Stunden Rennen
                </Text>



            </View>
        );
    }
}

