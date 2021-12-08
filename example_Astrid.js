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
import { sendNewSetRequest, sendWheelRequest, sendWheelsRequest} from "./tools_wheel"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button} from "react-native-web";

export default class AstridScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceList: [],
            raceID: 1,
            identifierSlicksCold: '',
            identifierSlicksMedium: '',
            identifierSlicksHot: '',
            identifierIntersIntermediate: '',
            identifierRainDryWet: '',
            identifierRainHeavyWet: '',
            contingentSlicksCold: -1,
            contingentSlicksMedium: -1,
            contingentSlicksHot: -1,
            contingentIntersIntermediate: -1,
            contingentRainDryWet: -1,
            contingentRainHeavyWet: -1,
            helpwheelid:0,
        }
        this.getRaceID=this.getRaceID.bind(this);
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }


    validateForm() {
        return (this.state.raceID != -1 && this.state.identifierSlicksCold != "" && this.state.contingentSlicksCold != -1 && this.state.identifierSlicksMedium != "" && this.state.contingentSlicksMedium != -1 && this.state.identifierSlicksHot != "" && this.state.contingentSlicksHot != -1 && this.state.identifierIntersIntermediate != "" && this.state.contingentIntersIntermediate != "" && this.state.identifierRainDryWet != "" && this.state.contingentRainDryWet != -1 && this.state.identifierRainHeavyWet != "" && this.state.contingentRainHeavyWet != -1)
    }



    // generate DataSet--------------------------------------------------
    //raceID, set, cat, subcat, identifier, numberOfSets
    generateAllSets(raceID,set,cat,subcat,numberOfSets){
        for(let i =1; i < parseInt(numberOfSets)+1;i++){
            console.log(i);
            this.generateNewWheelSet(raceID,i,cat,subcat);
        }
    }


    async generateNewWheelSet(raceID,setNr,cat,subcat){
        let cols = [];
        for (let i =0; i < 4; i++) {
            sendWheelRequest(0,'', '').then(Data => {
                console.log(Data);
                this.setState({helpwheelid: Data.id});
            }).catch(function (error) {
                console.log(error);
            })
            //const idwheel = await AsyncStorage.getItem('WheelID')
            console.log(this.state.helpwheelid);
            cols.push(this.state.helpwheelid);
        }
        console.log(cols)
       const wheelsid = await sendWheelsRequest(cols[0], cols[1], cols[2], cols[3], '');
        // sendNewSetRequest(raceID,setNr,cat,subcat,wheels)
        sendNewSetRequest(raceID,setNr,cat, subcat,wheelsid );
    }


    // end generate-------------------------


    handleSubmit = event => {
        event.preventDefault();
        this.sendNewContigentRequest(this.state.raceID, 1, "Slicks", "Cold", this.state.identifierSlicksCold, this.state.contingentSlicksCold);
        // raceID,set,cat,subcat,numberOfSets
        this.generateAllSets(this.state.raceID,"Slicks", "Cold", this.state.contingentSlicksCold)
        this.sendNewContigentRequest(this.state.raceID, 2, "Slicks", "Medium", this.state.identifierSlicksMedium, parseInt(this.state.contingentSlicksMedium));
        this.generateAllSets(this.state.raceID, 2, "Slicks", "Medium", parseInt(this.state.contingentSlicksMedium))
        this.sendNewContigentRequest(this.state.raceID, 3, "Slicks", "Hot", this.state.identifierSlicksHot, parseInt(this.state.contingentSlicksHot));
        this.generateAllSets(this.state.raceID, 3, "Slicks", "Hot", parseInt(this.state.contingentSlicksHot))
        this.sendNewContigentRequest(this.state.raceID, 4, "Inters", "Intermediate", this.state.identifierIntersIntermediate, parseInt(this.state.contingentIntersIntermediate));
        this.generateAllSets(this.state.raceID, 4, "Inters", "Intermediate", parseInt(this.state.contingentIntersIntermediate))
        this.sendNewContigentRequest(this.state.raceID, 5, "Rain", "DryWet", this.state.identifierRainDryWet, parseInt(this.state.contingentRainDryWet));
        this.generateAllSets(this.state.raceID, 5, "Rain", "DryWet", parseInt(this.state.contingentRainDryWet))
        this.sendNewContigentRequest(this.state.raceID, 6, "Rain", "HeavyWet", this.state.identifierRainHeavyWet, parseInt(this.state.contingentRainHeavyWet));
        this.generateAllSets(this.state.raceID, 6, "Rain", "HeavyWet", parseInt(this.state.contingentRainHeavyWet))
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

    async sendNewContigentRequest(raceID, set, cat, subcat, identifier, numberOfSets) {
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheels_start_astrid/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raceID: raceID,
                    set: set, //Zeilennummer der
                    cat: cat, // String Slick Inters, Rain
                    subcat: subcat,  // String Mischung
                    identifier: identifier, // Bezeichnung Str
                    numberOfSets: numberOfSets, // Kontigent Int
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log(data[0])
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    async getRaceID(event) {
        AsyncStorage.setItem("raceID", event.target.value);
        const id = await AsyncStorage.getItem("raceID");
        this.setState({raceID: id});
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
                </div>
                <View style={styles.viewStyles}>
                    <Text style={styles.textStyles}>
                        Kontingent Anlegen
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
                                < td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({identifierSlicksCold: x})}
                                />
                                </td>
                                <td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({contingentSlicksCold: x})}
                                />
                                </td>
                            </tr>

                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Medium (G/D)</td>
                                < td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({identifierSlicksMedium: x})}
                                />
                                </td>
                                <td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({contingentSlicksMedium: x})}
                                />
                                </td>
                            </tr>

                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Hot (I/F)</td>
                                < td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({identifierSlicksHot: x})}
                                />
                                </td>
                                <td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({contingentSlicksHot: x})}
                                />
                                </td>
                            </tr>

                            <tr style={{backgroundColor: '#B0C4DE'}}>
                                <th style={this.tdStyle}>Inters</th>
                                <td style={this.tdStyle}>Intermediate (H+/E+)</td>
                                < td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({identifierIntersIntermediate: x})}
                                />
                                </td>
                                <td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({contingentIntersIntermediate: x})}
                                />
                                </td>
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
                                < td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({identifierRainDryWet: x})}
                                />
                                </td>
                                <td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({contingentRainDryWet: x})}
                                />
                                </td>
                            </tr>
                            <tr style={{backgroundColor: '#F5FFFA'}}>
                                <td style={this.tdStyle}></td>
                                <td style={this.tdStyle}>Heavy wet (A/A)</td>
                                < td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({identifierRainHeavyWet: x})}
                                />
                                </td>
                                <td style={this.tdStyle}><TextInput
                                    style={{height: 20}}
                                    onChangeText={(x) => this.setState({contingentRainHeavyWet: x})}
                                />
                                </td>
                            </tr>

                        </table>
                    </div>

                    <Button
                        disabled={!this.validateForm()}
                        title="Daten speichern"
                        onPress={this.handleSubmit}
                    />

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
