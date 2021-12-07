import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshToken, syncData} from "./tools";
import {
    StyleSheet,
    Image,
    TouchableHighlight,
    SectionList,
    TouchableOpacity
} from 'react-native';
import {getRaceList, getWeatherTab, timeoutPromise,getWheelsList,getRaceDetails_by_ID} from "./tools"
import { Logs } from 'expo'

Logs.enableExpoCliLogging()

export default class ShowRaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: "1",
            place: "2",
            type:"3",
            raceList: [],
            raceID: 1,
            RaceDetails: [{"date":10000}],
            listWheelStart:[],
            zwei: 2,
            i_11: '',
            i_12: '',
            i_21: '',
            i_22: '',
            i_31: '',
            i_32: '',
            i_41: '',
            i_42: '',
            i_51: '',
            i_52: '',
            i_61: '',
            i_62: '',
        }
        this.getRaceID=this.getRaceID.bind(this);
        this.getRaceDetails=this.getRaceDetails.bind(this);
        this.Action=this.Action.bind(this);
        this.getWheelsStart=this.getWheelsStart.bind(this);
    }

     changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    validateForm() {
        return (this.state.raceID != -1)
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


    async getRaceID(event) {
        AsyncStorage.setItem('raceID', event.target.value);
        const id = await AsyncStorage.getItem('raceID');
        this.setState({raceID: id});
    }
    async getRaceDetails(){
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        AsyncStorage.setItem('raceID', this.state.raceID);
        const raceID = await AsyncStorage.getItem('raceID');
        console.log([raceID])
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
        AsyncStorage.setItem('raceID', this.state.raceID);
        const raceID = await AsyncStorage.getItem('raceID');
        console.log(raceID)
        getWheelsList(accesstoken,raceID).then(liste => {
            console.log(liste);
            this.setState({listWheelStart: liste});
        }).catch(function (error) {
            console.log(error);
        })
    }

    Action(){
        let liste=[];
        class Person{
            constructor(set, one, two){
                this.set=set;
                this.identifier=one;
                this.numberOfSets=two;
            }
        }
        for(let i=0; i<6; i++){
            liste[i]=new Person(i+1, i*2, i*3);
            console.log(liste[i]);
        }
        let liste1 = liste.filter(entry => entry.set==1);
        console.log(liste1[0]["identifier"]);
        this.setState({i_11:liste1[0]["identifier"]});
        this.setState({i_12:liste1[0]["numberOfSets"]});
        let liste2 = liste.filter(entry => entry.set==2);
        console.log(liste1[0]["identifier"]);
        this.setState({i_21:liste2[0]["identifier"]});
        this.setState({i_22:liste2[0]["numberOfSets"]});
        let liste3 = liste.filter(entry => entry.set==3);
        console.log(liste1[0]["identifier"]);
        this.setState({i_31:liste3[0]["identifier"]});
        this.setState({i_32:liste3[0]["numberOfSets"]});
        let liste4 = liste.filter(entry => entry.set==4);
        console.log(liste1[0]["identifier"]);
        this.setState({i_41:liste4[0]["identifier"]});
        this.setState({i_42:liste4[0]["numberOfSets"]});
        let liste5 = liste.filter(entry => entry.set==5);
        console.log(liste1[0]["identifier"]);
        this.setState({i_51:liste5[0]["identifier"]});
        this.setState({i_52:liste5[0]["numberOfSets"]});
        let liste6 = liste.filter(entry => entry.set==6);
        console.log(liste1[0]["identifier"]);
        this.setState({i_61:liste6[0]["identifier"]});
        this.setState({i_62:liste6[0]["numberOfSets"]});

        const list=[{place: "Bonn"}];
        this.setState({place: list[0]["place"]});
    }



    render() {
        let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));
        return (
            <View style={this.order}>
                <div style={this.container}>
                    <Text>{this.state.raceID}</Text>
                    <label >
                        <h2 >Rennen auswählen:</h2>
                        <select value={this.state.id} onChange={this.getRaceID}>
                            {optionTemplate}
                        </select>
                    </label>
                    <br></br>
                    <Text style={{fontSize:'20px'}}>Datum:{"  "}{this.state.date}</Text>
                    <br></br>
                    <Text style={{fontSize:'20px'}}>Ort:{"  "}{this.state.place}</Text>
                    <br></br>
                    <Text style={{fontSize:'20px'}}>Art des Rennens:{"  "}{this.state.type}</Text>
                     <br></br>
                    <Button
                        disabled= {!this.validateForm()}
                        title="DATEN ANZEIGEN"
                        onPress={this.getWheelsStart}
                    />
                </div>
                <View style={styles.viewStyles}>
                    <Text style={styles.textStyles}>
                        Zur Verfügung stehendes Kontingent:
                    </Text>
                    <br></br>
                    <div>
                        <table style={this.tableStyle}>
                            <tr style={{backgroundColor: '#B0C4DE'}}>
                                <th style={this.thStyle}></th>
                                <th style={this.thStyle}>Mischung</th>
                                <th style={this.thStyle}>Bezeichnung</th>
                                <th style={this.thStyle}>Kontingent</th>
                            </tr>

                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <th style={this.thStyle}>Slicks</th>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}></td>
                            </tr>
                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Cold (H/E)</td>
                                < td style={this.tdStyle}>{this.state.i_11}</td>
                                < td style={this.tdStyle}>{this.state.i_12}</td>
                            </tr>

                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Medium (G/D)</td>
                                < td style={this.tdStyle}>{this.state.i_21}</td>
                                < td style={this.tdStyle}>{this.state.i_22}</td>

                            </tr>

                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Hot (I/F)</td>
                                < td style={this.tdStyle}>{this.state.i_31}</td>
                                < td style={this.tdStyle}>{this.state.i_32}</td>
                            </tr>

                            <tr style={{backgroundColor: '#B0C4DE'}}>
                                <th style={this.tdStyle}>Inters</th>
                                <td style={this.tdStyle}>Intermediate (H+/E+)</td>
                                < td style={this.tdStyle}>{this.state.i_41}</td>
                                < td style={this.tdStyle}>{this.state.i_42}</td>
                            </tr>
                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <th style={this.tdStyle}>Rain</th>
                                <td style={this.tdStyle}></td>
                                < td style={this.tdStyle}></td>
                                <td style={this.tdStyle}></td>
                            </tr>
                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Dry wet (T/T)</td>
                                < td style={this.tdStyle}>{this.state.i_51}</td>
                                < td style={this.tdStyle}>{this.state.i_52}</td>
                            </tr>
                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Heavy wet (A/A)</td>
                                < td style={this.tdStyle}>{this.state.i_61}</td>
                                < td style={this.tdStyle}>{this.state.i_62}</td>
                            </tr>

                        </table>
                    </div>
                    <Button
                        title="zurück"
                        onPress={this.changeRace}
                    />


                </View>
            </View>
        );

    }
     tableStyle = {
    textAlign: 'center',
     fontFamily:'arial, sans-serif',
        borderCollapse:'collapse',
        width:'50%',
        marginLeft:'auto',
        marginRight:'auto',
    border: '2px solid #dddddd',
    }
    tdStyle={
        border:'2px solid #dddddd',
        textAlign:'left',
        padding:'8px'
    }
    thStyle={
        border:'2px solid #dddddd',
        textAlign:'left',
        padding:'8px'
    }
    order={
        border: '1px solid #dddddd',
        justifyContent: 'space-around',
        flexDirection: 'row',
        padding: '0',
        backgroundColor: 'white',
        height: '90%'

    }
    container={
        width:"20%",
        padding: '100px',
        border: '1px solid #B0C4DE',
        backgroundColor: '#F5FFFA'
    }



}