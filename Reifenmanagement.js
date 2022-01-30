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
import {get_Dict_WheelOrder, getDropdown, getWheelSetInformation, getWheelInformations} from "./tools_get_wheels";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";
import ScrollViewBase from "react-native-web/dist/exports/ScrollView/ScrollViewBase";

export default class WheelScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_formel: [],
            formel: "",
            raceID: 0,
            dataViews: [{'name': "Alle Werte", 'id': 1}, {'name': "Heizdaten", 'id': 2}, {
                'name': "Laufleistungen",
                'id': 3
            }, {'name': "Kalt- und Warmdruckwerte", 'id': 4}],
            selectedView: 1,
        }
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    save_changes_wheel = event => {
        this.changeSingleWheel(event.target.id, [[event.target.name, event.target.value]]);
        let copyArray = this.state.list_formel;
        this.state.list_formel.forEach( function (element,index){if(element.setid==event.target.id){copyArray[index][event.target.type]=event.target.value}});
        this.setState({list_formel:copyArray});
        console.log(this.state.list_formel);
    };

    save_changes_wheelSet = event => {
        this.changeWheelSet(event.target.id, [[event.target.name, event.target.value]]);
        //iterieren über this.state.list_formel
        let copyArray = this.state.list_formel;
        this.state.list_formel.forEach( function (element,index){if(element.setid==event.target.id){copyArray[index][event.target.name]=event.target.value}});
        this.setState({list_formel:copyArray});
        console.log(this.state.list_formel);
    };

    // save change
    changeSingleWheel(id, liste_attribute) {
        console.log(liste_attribute);
        console.log(id);
        timeoutPromise(1000, fetch(
            'https://api.race24.cloud/wheel_cont/change_single_wheel', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    liste_attribute: liste_attribute,
                })
            })
        ).then(response => response.json()).then(data => {
            if (data[1] == 200) {
                console.log("Wheel Changed")
            } else {
                console.log("failed")
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    changeWheelSet(id, liste_attribute) {
        console.log(liste_attribute);
        console.log(id);
        timeoutPromise(1000, fetch(
            'https://api.race24.cloud/wheel_cont/change_wheelSet', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    liste_attribute: liste_attribute,
                })
            })
        ).then(response => response.json()).then(data => {
            if (data[1] == 200) {
                console.log(data[0]);
            } else {
                console.log("failed")
            }
        }).catch(function (error) {
            console.log(error);
        })
    }
    // end save change

    async getTabularData() {
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        await getWheelInformations(accesstoken, raceID).then(formellistTab => {
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
        let header = ['Kategorie', 'Status', 'Temperatur',
            'Reifen Luftdruck', 'Reifen ID'];
        //let header = Object.keys(this.state.list_formel[0]);
        return header.map((key, index) => {
            return <th bgcolor='#696969'
                       style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                       key={index}>{key.toUpperCase()}</th>
        })
    }

    renderTableData() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            return (
                <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={list_formel.setid}>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setid} placeholder='test' value={list_formel.cat}
                               name={'cat'}  onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} name={'subcat'} placeholder={list_formel.subcat}
                               value={list_formel.subcat} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} name={'variant'} placeholder={'Variante'}
                               value={list_formel.variant} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setid} placeholder={list_formel.status} value={list_formel.status}
                        name = {'status'} onChange={this.save_changes_wheelSet}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setid} placeholder={'Temperatur'} value={list_formel.temp_air}
                        name = {'temp_air'}  onChange={this.save_changes_wheelSet}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setid} placeholder={'Luftdruck BR'} value={list_formel.br_pressure}
                        name = {'pressure'} type={'br_pressure'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid}  placeholder={'Luftdruck BL'} value={list_formel.bl_pressure}
                        name = {'pressure'} type={'bl_pressure'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'Luftdruck FL'} value={list_formel.fr_pressure}
                        name = {'pressure'} type={'fr_pressure'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'Luftdruck FL'} value={list_formel.fl_pressure}
                        name = {'pressure'} type={'fl_pressure'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setid} placeholder={'ID BL'} value={list_formel.bl_wheel_id}
                        name = {'wheel_id'} type={'bl_wheel_id'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'ID BR'} value={list_formel.br_wheel_id}
                        name = {'wheel_id'} type={'br_wheel_id'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'ID FR'} value={list_formel.fr_wheel_id}
                        name = {'wheel_id'} type={'fr_wheel_id'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setid} placeholder={'ID FL'} value={list_formel.fl_wheel_id}
                        name = {'wheel_id'} type={'fl_wheel_id'} onChange={this.save_changes_wheelSet}/></td>
                </tr>
            )
        })
    }

    changeView = event => {
        this.setState({selectedView: event.target.value});
    }

    render() {
        let optionTemplate = this.state.dataViews.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));
        return (
            <View style={styles.viewStyles}>
                <h1>{this.state.selectedView}</h1>
                <label style={{fontSize: 16, fontFamily: 'arial', textAlign: 'center'}}> Ansicht: <select
                    value={this.state.selectedView} onChange={this.changeView}>
                    {optionTemplate}
                </select>
                </label>
                <Text style={{height: 20}}>Dropdownliste, Set auswählen von Rennen</Text>
                <Text style={{height: 20}}>Tabelle, alle Attribute des Sets in editierbarer Tabelle</Text>

                <ScrollView>
                    <div>
                        <h1 id='title'>Angelegte Reifen</h1>
                        <table id='list_formel'>
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