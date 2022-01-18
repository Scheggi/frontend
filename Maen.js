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
import { PieChart, Pie, Sector, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Line, LineChart, BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';


const COLORS = ['#0B0B61','#FF8042', '#FFBB28','#0088FE', '#00C49F', '#8884D8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {percent!=0 &&`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

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


export default class TestScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceID :0,
            data: [{name: 'Slicks Cold', value: 0},
                   { name: 'Slicks Medium', value: 0 },
                   { name: 'Slicks Hot', value: 0 },
                   { name: 'Inters Intermediate', value: 0 },
                   { name: 'Rain Dry Wet', value: 0 },
                   { name: 'Rain Heavy Wet', value: 0 },
            ],
            raceList: [],
            showLegend: false,
            showText: false,
            showWeatherData: false,

        }
    }
   async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({raceList: racelistDropdown})
        }).catch(function (error) {
            console.log(error);
        })
    }
   validateForm() {
       return this.state.raceID!=0;
    }
     async getRaceID(event) {
        AsyncStorage.setItem('raceID', event.target.value);
        const id = await AsyncStorage.getItem('raceID');
        this.setState({raceID: id});
    }


    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    handleSubmit = event =>{
        event.preventDefault();
        //Funktion aufrufen vom Backend mit RaceID
        const numberOfSlicksCold= 10;
        const numberOfSlicksMedium= 5;
        const numberOfSlicksHot= 2;
        const numberOfIntersIntermediate= 2;
        const numberOfRainDryWet= 4;
        const numberOfRainHeavyWet= 8;
        const data =[{name: 'Slicks Cold', value: numberOfSlicksCold},
                     { name: 'Slicks Medium', value: numberOfSlicksMedium },
                     { name: 'Slicks Hot', value:  numberOfSlicksHot},
                     { name: 'Inters Intermediate', value: numberOfIntersIntermediate },
                     { name: 'Rain Dry Wet', value: numberOfRainDryWet },
                     { name: 'Rain Heavy Wet', value: numberOfRainHeavyWet }
        ];
        this.setState({data: data });
        this.setState({showLegend: 1});
        this.setState({showText: 1});
        this.setState({showWeatherData: 1});
    }


    render() {
         let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));
        return (
        <View style={viewStyles1}>
            {/*<View style={{marginLeft: 'auto', marginRight: 'auto'}}>*/}
                <label /*style={{fontSize: 16, fontFamily: 'arial', textAlign: 'center'}}*/ > Rennen auswählen: <select
                    value={this.state.id} onChange={this.getRaceID}>
                    {optionTemplate}
                </select>
                </label>
            {/*</View>*/}
         <Button
                        //disabled={!this.validateForm()}
                        title="Daten anzeigen"
                        onPress={this.handleSubmit}
                    />
                <br></br>
            <View style={{flexDirection: 'row'}}>
         <div>
             {this.state.showText &&
             <Text style={{fontSize: 30, fontWeight: 'bold', fontFamily: 'arial',}}>Reifendaten:</Text>
             }
         <PieChart width={400} height={400}>
            <Pie
            dataKey="value"
            isAnimationActive={true}
            labelLine={false}
            data={this.state.data}
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label={renderCustomizedLabel}
          >
          {this.state.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
            <Tooltip />
            {this.state.showLegend &&
                <Legend/>
            }
        </PieChart>
        </div>
        <div>
            {this.state.showText &&
            <Text style={styles.textStyles}>
                Wetterdaten:
                <br></br>
                <br></br>
            </Text>
            }
            {this.state.showWeatherData &&
                <LineChart width={600} height={400} data={data} margin={{
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
            }
          </div>
            </View>
        <Button
                        title="zurück"
                        onPress={this.changeRace}
                />
            <Text style={{height:50}}></Text>
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
        overflowX: 'scroll',
    };
