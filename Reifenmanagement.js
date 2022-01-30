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
    ScrollView
} from 'react-native';
import {styles} from "./styles"
import {getRaceList, getWeatherTab, timeoutPromise, getWheelsList, getRaceDetails_by_ID, getFormelList} from "./tools"
import {get_Dict_WheelOrder, getDropdown,getWheelSetInformation,getWheelInformations} from "./tools_get_wheels";

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import ScrollViewBase from "react-native-web/dist/exports/ScrollView/ScrollViewBase";

export default class WheelScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_formel:[],
            formel:"",
            raceID:0
        }
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }



    async sendNewFormelRequest(formel) {
        console.log(formel)
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/formel/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formel:formel,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    this.getTabularData()
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    async getTabularData(){
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        await getWheelInformations(accesstoken,raceID).then(formellistTab => {
            console.log(formellistTab);
            this.setState({list_formel: formellistTab});
        }).catch(function (error) {
            console.log(error);
        })
    }

    async componentDidMount() {
        await this.getTabularData()
        const raceid = await AsyncStorage.getItem('raceItem');
        this.setState({raceID: raceid});
    }



   renderTableHeader() {
    let header = ['Kategorie', 'Status','Temperatur',
        'Reifen Luftdruck','Reifen ID'];
      //let header = Object.keys(this.state.list_formel[0]);
      return header.map((key, index) => {
         return <th bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}} key={index}>{key.toUpperCase()}</th>
      })
   }


    renderTableData() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            //const { n, formel } =list_formel //destructuring
            return (
            <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}} key={list_formel.setNr}>
               <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}} >
                   <input id ={list_formel.setNr}  placeholder={list_formel.cat} value={list_formel.cat} />
               <input id ={list_formel.setNr}  placeholder={list_formel.subcat} value={list_formel.subcat} />
                    <input id={list_formel.setNr}  placeholder={list_formel.variant} value={list_formel.variant} />
               </td>
                 <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}} ><input id ={list_formel.setNr}  placeholder={list_formel.status} value={list_formel.status} /></td>
               <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}} > <input id ={list_formel.setNr}  placeholder={list_formel.temp} value={list_formel.temp} /> </td>
                 <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}} >
                     <input id ={list_formel.setNr}  placeholder={list_formel.br_pressure} value={list_formel.br_pressure}/>
                 <input id ={list_formel.setNr}  placeholder={list_formel.bl_pressure} value={list_formel.bl_pressure}/>
                     <input id ={list_formel.setNr}  placeholder={list_formel.fr_pressure} value={list_formel.fr_pressure}/>
                      <input id ={list_formel.setNr}  placeholder={list_formel.fl_pressure} value={list_formel.fl_pressure}/>
                 </td>
               <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}} >
                   <input id ={list_formel.setNr}  placeholder={list_formel.bl_wheel_id} value={list_formel.bl_wheel_id}/>
                   <input id ={list_formel.setNr}  placeholder={list_formel.br_wheel_id} value={list_formel.br_wheel_id}/>
                   <input id ={list_formel.setNr}  placeholder={list_formel.fr_wheel_id} value={list_formel.fr_wheel_id}/>
               <input id ={list_formel.setNr}  placeholder={list_formel.fl_wheel_id} value={list_formel.fl_wheel_id}/></td>
                </tr>
         )
      })
   }

    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={{height: 20}}>Dropdownliste, Set auswählen von Rennen</Text>
                <Text style={{height: 20}}>Tabelle, alle Attribute des Sets in editierbarer Tabelle</Text>

                <ScrollView>
                <div>
                <h1 id='title'>Angelegte Reifen</h1>
                <table  id='list_formel'>
                   <tbody>
                   {this.renderTableHeader()}
                      {this.renderTableData()}
                   </tbody>
                </table>
                </div>
                </ScrollView>
                <Text style={{height: 20}}></Text>
                <Button
                        title="zurück"
                        onPress={this.changeRace}
                />
            </View>
        );
    }
}