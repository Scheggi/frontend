import React from "react";
import {Legend, Tooltip, Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';
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

const data = [
    {
      Uhrzeit: "08:00",
      Lufttemperatur: 27,
      Streckentemperatur: 20,
    },
    {
      Uhrzeit: "09:00",
      Lufttemperatur: 30,
      Streckentemperatur: 23,
    },
    {
      Uhrzeit: "09:30",
      Lufttemperatur: 21,
      Streckentemperatur: 28,
    },
    {
      Uhrzeit: "10:00",
      Lufttemperatur: 33,
      Streckentemperatur: 40,
    },
    {
      Uhrzeit: "07:22",
      Lufttemperatur: 55,
      Streckentemperatur: 60,
    },
    {
      Uhrzeit: "08:30",
      Lufttemperatur: 25,
      Streckentemperatur: 50,
    },
    {
      Uhrzeit: "11:22",
      Lufttemperatur: 41,
      Streckentemperatur: 19,
    },
    {
      Uhrzeit: "11:30",
      Lufttemperatur: 5,
      Streckentemperatur: 12,
    },

  ];



export default class MaenScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceID :0,

        }
    }
    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }


    render() {
        return (
         <View style={viewStyles1}>
            <Text style={styles.textStyles}>
               Wetterdaten
            </Text>


         <LineChart width={800} height={300} data={data} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}>
           <CartesianGrid strokeDasharray="3 3"></CartesianGrid>
           <XAxis dataKey="Uhrzeit"></XAxis>
           <YAxis></YAxis>
           <Tooltip></Tooltip>
           <Legend></Legend>
          <Line type="monotone" dataKey="Lufttemperatur"     stroke="red" />
          <Line type="monotone" dataKey="Streckentemperatur" stroke="green" />
          </LineChart>

         <Button
                    title="zurück"
                    onPress={this.changeRace}
            />


        </View>
        );
    }
}
const viewStyles1= {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'arial',
        overflowY: 'scroll',

    };
