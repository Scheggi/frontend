import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshToken,createNewRaceRequest, syncData} from "./tools";
import {
    StyleSheet,
    Image,
    TouchableHighlight,
    SectionList,
    TouchableOpacity
} from 'react-native';
import {getRaceList, timeoutPromise} from "./tools"
import {sendNewSetRequest, sendWheelRequest, sendWheelsRequest} from "./tools_wheel";


export default class NewRaceScreen extends React.Component {
  constructor(props) {
        super(props);
        this.state = {
            type: '',
            place: '',
            date: '',
            raceList: [],
            raceID: -1,
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
        }
    }

    validateForm() {
        return (this.state.date.length > 0 && this.state.place.length >0 && this.state.identifierSlicksCold != "" && this.state.contingentSlicksCold != -1 && this.state.identifierSlicksMedium != "" && this.state.contingentSlicksMedium != -1 && this.state.identifierSlicksHot != "" && this.state.contingentSlicksHot != -1 && this.state.identifierIntersIntermediate != "" && this.state.contingentIntersIntermediate != "" && this.state.identifierRainDryWet != "" && this.state.contingentRainDryWet != -1 && this.state.identifierRainHeavyWet != "" && this.state.contingentRainHeavyWet != -1)
    }

    handleSubmit = event => {
        event.preventDefault();
        this.generateNewRace(this.state.type,this.state.place,this.state.date);
    }

        // generate DataSet------------------------------------------------------------------------
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
            const accesstoken = await AsyncStorage.getItem('acesstoken');
            await sendWheelRequest(accesstoken,0,'', '').then(Data => {
                console.log(Data);
                cols.push(Data);
            }).catch(function (error) {
                console.log(error);
            })
            //const idwheel = await AsyncStorage.getItem('WheelID')

        }
        console.log(cols)
        const accesstoken = await AsyncStorage.getItem('acesstoken');
      await sendWheelsRequest(accesstoken, parseInt( cols[0]), parseInt(cols[1]), parseInt(cols[2]), parseInt(cols[3]), '').then(Data => {
                console.log(Data);
                cols.push(Data);
            }).catch(function (error) {
                console.log(error);
            });
        console.debug(cols[4])
        // sendNewSetRequest(raceID,setNr,cat,subcat,wheels)
        sendNewSetRequest(raceID,setNr,cat, subcat,cols[4] );
    }


    // end generate---------------------------------------------------------------------------




     async generateNewRace(type,place,date){
      let id  = '';
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        await createNewRaceRequest(accesstoken,type,place,date).then(Data => {
                console.log(Data);
                id = Data;
            }).catch(function (error) {
                console.log(error);
            })
         console.log(id)
         this.setState({raceID:id});
        console.log(this.state.raceID);
         this.sendNewContigentRequest(this.state.raceID, 1, "Slicks", "Cold", this.state.identifierSlicksCold, this.state.contingentSlicksCold);
        // raceID,set,cat,subcat,numberOfSets
        this.generateAllSets(this.state.raceID,"Slicks", "Cold", this.state.contingentSlicksCold)
        this.sendNewContigentRequest(this.state.raceID, 2, "Slicks", "Medium", this.state.identifierSlicksMedium, parseInt(this.state.contingentSlicksMedium));
        this.generateAllSets(this.state.raceID, 2, "Slicks", "Medium", parseInt(this.state.contingentSlicksMedium));
        this.sendNewContigentRequest(this.state.raceID, 3, "Slicks", "Hot", this.state.identifierSlicksHot, parseInt(this.state.contingentSlicksHot));
        this.generateAllSets(this.state.raceID, 3, "Slicks", "Hot", parseInt(this.state.contingentSlicksHot));
        this.sendNewContigentRequest(this.state.raceID, 4, "Inters", "Intermediate", this.state.identifierIntersIntermediate, parseInt(this.state.contingentIntersIntermediate));
        this.generateAllSets(this.state.raceID, 4, "Inters", "Intermediate", parseInt(this.state.contingentIntersIntermediate));
        this.sendNewContigentRequest(this.state.raceID, 5, "Rain", "DryWet", this.state.identifierRainDryWet, parseInt(this.state.contingentRainDryWet));
        this.generateAllSets(this.state.raceID, 5, "Rain", "DryWet", parseInt(this.state.contingentRainDryWet));
        this.sendNewContigentRequest(this.state.raceID, 6, "Rain", "HeavyWet", this.state.identifierRainHeavyWet, parseInt(this.state.contingentRainHeavyWet));
        this.generateAllSets(this.state.raceID, 6, "Rain", "HeavyWet", parseInt(this.state.contingentRainHeavyWet));
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
                console.log(data)
                if (data[1]==200) {
                    console.log(data[0]);
                    return data[0].id
                }
                else {
                    console.log("failed");
                    return data[0].id;
                }
                return data[0].id;
            }).catch(function (error) {
                console.log(error);
                return 0;
            })
    }

    render() {
        return (
            <View style={this.order}>
                <div style={this.container}>
                    <h1 style={{fontSize: 45, fontWeight: 'bold',color: 'black'}}>
                    Neues Rennen anlegen
                </h1>
                <View >
                    <Text >Ersten Tag des Rennen angeben im Format DD.MM.YYYY: </Text>
                    <TextInput
                        style={{height:50 }}
                        placeholder=" DD.MM.YYYY"
                        onChangeText={(text) => this.setState({date:text})}
                    />
                    <Text>Ort angeben: </Text>
                    <TextInput
                        style={{height: 50}}
                        placeholder=" Ort"
                        onChangeText={(place) => this.setState({place:place})}
                    />
                    <Text> Art des Rennens angeben: </Text>
                    <TextInput
                        style={{height: 50}}
                        placeholder=" 24 Stunden Rennen"
                        onChangeText={(type) => this.setState({type:type})}
                    />
                    <Button
                        disabled={!this.validateForm()}
                        title="Rennen anlegen"
                        onPress={this.handleSubmit}
                    />
                </View>

                </div>
                <View style={styles.viewStyles}>
                    <Text style={this.textStyles1}>
                        Kontingent für das Rennen festlegen :
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
        width:"35%",
        padding: '50px',
        border: '1px solid #B0C4DE',
        backgroundColor: '#F5FFFA',
    }
    textStyles1={
         color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    }



}