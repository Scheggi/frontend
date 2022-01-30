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

    handleHeatStart = event => {
        event.preventDefault();
        //blablabla
    }

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
        this.setState({selectedView: 1});
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
                <tr bgcolor='#696969'
                    style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={list_formel.setNr}>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Setbezeichnung'} value={list_formel.description}
                            name={'description'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Datum und Uhrzeit'}
                            value={list_formel.order_start} name={'order_start'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Kategorie'} value={list_formel.cat} name={'cat'}
                               onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Unterkategorie'} value={list_formel.subcat}
                               name={'subcat'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Bearbeitungsvariante'}
                               value={list_formel.variant} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={list_formel.status} value={list_formel.status}
                            name={'status'} onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Felgentemperatur'}
                               value={list_formel.temp_air} name={'temp_air'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck FL'} value={list_formel.fl_pressure}
                               name={'air_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck FR'} value={list_formel.fr_pressure}
                               name={'air_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck BL'} value={list_formel.bl_pressure}
                               name={'air_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck BR'} value={list_formel.br_pressure}
                               name={'air_press'} onChange={this.save_changes_wheel}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'bleed initial'}
                               value={list_formel.bleed_initial} name={'bleed_initial'}
                               onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'bleed hot'} value={list_formel.bleed_hot}
                               name={'bleed_hot'}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}
                        onChange={this.save_changes_wheelSet}>
                        <input id={list_formel.setNr} placeholder={'Heiztemperatur'} value={list_formel.temp_heat}
                               name={'temp_heat'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Heizdauer'} value={list_formel.heat_duration}
                               name={'heat_duration'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Heizstart'} value={list_formel.heat_start}
                               name={'heat_start'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Heizende'} value={list_formel.heat_end}
                               name={'heat_end'} onChange={this.save_changes_wheelSet}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Zeit der Messung'}
                               value={list_formel.heat_press_timestamp} name={'heat_press_timestamp'}
                               onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck FL'}
                               value={list_formel.fl_hot_air_press} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck FR'}
                               value={list_formel.fr_hot_air_press} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck BL'}
                               value={list_formel.bl_hot_air_press} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck BR'}
                               value={list_formel.br_hot_air_press} name={'hot_air_press'}
                               onChange={this.save_changes_wheel}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Target vorne'}
                               value={list_formel.heat_press_front} name={'heat_press_front'}
                               onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Target hinten'}
                               value={list_formel.heat_press_back} name={'heat_press_back'}
                               onChange={this.save_changes_wheelSet}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'nicht gebleedet'} value={list_formel.gebleedet}
                               name={'gebleedet'} onChange={this.save_changes_wheelSet}/>
                        <input id={list_formel.setNr} placeholder={'Bleed FL'} value={list_formel.fl_bleed_press}
                               name={'bleed_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Bleed FR'} value={list_formel.fr_bleed_press}
                               name={'bleed_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Bleed BL'} value={list_formel.bl_bleed_press}
                               name={'bleed_press'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'Bleed BR'} value={list_formel.br_bleed_press}
                               name={'bleed_press'} onChange={this.save_changes_wheel}/>
                    </td>

                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'ID FL'} value={list_formel.fl_id_scan}
                               name={'id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'ID FR'} value={list_formel.fr_id_scan}
                               name={'id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'ID BL'} value={list_formel.bl_id_scan}
                               name={'id_scan'} onChange={this.save_changes_wheel}/>
                        <input id={list_formel.setNr} placeholder={'ID BR'} value={list_formel.br_id_scan}
                               name={'id_scan'} onChange={this.save_changes_wheel}/></td>
                </tr>
            )

        })
    }

    renderTableData2() {
        console.log(this.state.list_formel)

        return this.state.list_formel.map((list_formel, index) => {
            //const { n, formel } =list_formel //destructuring
            return (
                <tr bgcolor='#696969'
                    style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={list_formel.setNr}>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Setbezeichnung'} value={list_formel.description}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Datum und Uhrzeit'}
                            value={list_formel.order_start}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Heiztemperatur'} value={list_formel.temp_heat}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Heizdauer'} value={list_formel.heat_duration}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Heizstart'} value={list_formel.heat_start}/>
                        <input type="button" value="HEIZEN STARTEN" onClick={this.handleHeatStart}/>
                    </td>

                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Heizende'} value={list_formel.heat_end}/></td>

                </tr>
            )

        })

    }

    renderTableData3() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            //const { n, formel } =list_formel //destructuring
            return (
                <tr bgcolor='#696969'
                    style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={list_formel.setNr}>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Setbezeichnung'} value={list_formel.description}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Datum und Uhrzeit'}
                            value={list_formel.order_start}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Kategorie'} value={list_formel.cat}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Unterkategorie'} value={list_formel.subcat}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={list_formel.status} value={list_formel.status}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={list_formel.runtime} value={list_formel.runtime}/>
                    </td>

                </tr>
            )

        })
    }

    renderTableData4() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            //const { n, formel } =list_formel //destructuring
            return (
                <tr bgcolor='#696969'
                    style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}}
                    key={list_formel.setNr}>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Setbezeichnung'} value={list_formel.description}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input
                            id={list_formel.setNr} placeholder={'Datum und Uhrzeit'}
                            value={list_formel.order_start}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Felgentemperatur'}
                               value={list_formel.temp_air}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck FL'} value={list_formel.fl_pressure}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck FR'} value={list_formel.fr_pressure}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck BL'} value={list_formel.bl_pressure}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck BR'} value={list_formel.br_pressure}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'bleed initial'}
                               value={list_formel.bleed_initial}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'bleed hot'} value={list_formel.bleed_hot}/></td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck FL'} value={list_formel.fl_pressure}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck FR'} value={list_formel.fr_pressure}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck BL'} value={list_formel.bl_pressure}/>
                        <input id={list_formel.setNr} placeholder={'Kaltdruck BR'} value={list_formel.br_pressure}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Zeit der Messung'}
                               value={list_formel.heat_press_timestamp}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck FL'}
                               value={list_formel.fl_hot_air_press}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck FR'}
                               value={list_formel.fr_hot_air_press}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck BL'}
                               value={list_formel.bl_hot_air_press}/>
                        <input id={list_formel.setNr} placeholder={'Warmdruck BR'}
                               value={list_formel.br_hot_air_press}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Target vorne'}
                               value={list_formel.heat_press_front}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'Target hinten'}
                               value={list_formel.heat_press_back}/>
                    </td>
                    <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}}>
                        <input id={list_formel.setNr} placeholder={'nicht gebleedet'} value={list_formel.gebleedet}/>
                        <input id={list_formel.setNr} placeholder={'Bleed FL'} value={list_formel.fl_bleed_press}/>
                        <input id={list_formel.setNr} placeholder={'Bleed FR'} value={list_formel.fr_bleed_press}/>
                        <input id={list_formel.setNr} placeholder={'Bleed BL'} value={list_formel.bl_bleed_press}/>
                        <input id={list_formel.setNr} placeholder={'Bleed BR'} value={list_formel.br_bleed_press}/>
                    </td>

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
            <View style={{overflowY: 'scroll', overflowX: 'scroll', flex: 1}}>
                <h1>{this.state.selectedView}</h1>
                <label style={{fontSize: 16, fontFamily: 'arial', textAlign: 'center'}}> Ansicht: <select
                    value={this.state.selectedView} onChange={this.changeView}>
                    {optionTemplate}
                </select>
                </label>
                <Text style={{height: 20}}>Dropdownliste, Set auswählen von Rennen</Text>
                <Text style={{height: 20}}>Tabelle, alle Attribute des Sets in editierbarer Tabelle</Text>


                <div>
                    <h1 id='title'>Angelegte Reifen</h1>
                    <table id='list_formel'>
                        <tbody>
                        {this.renderTableHeader()}
                        {this.state.selectedView == 1 && this.renderTableData()}
                        {this.state.selectedView == 2 && this.renderTableData2()}
                        {this.state.selectedView == 3 && this.renderTableData3()}
                        {this.state.selectedView == 4 && this.renderTableData4()}
                        </tbody>
                    </table>
                </div>
                <Text style={{height: 20}}></Text>
                <Button
                    title="zurück"
                    onPress={this.changeRace}
                />
            </View>
        );
    }
}