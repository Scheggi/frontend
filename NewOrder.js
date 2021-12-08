import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList} from "./tools";

export default class NewOrderScreen extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            raceid: 0,
            tyretype: '',
            tyremix: '',
            term: '',
            variant: '',
            number: '',
            orderdate: '',
            ordertime: '',
            pickuptime: '',
            raceList: [],

            time: {},
            seconds: 1800,
            timervalue: "",
        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    getRaceID = event => {
        const id = event.target.value;
        AsyncStorage.setItem("raceIDHelper", event.target.value);
        this.saveRaceIDinState();
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.replace('Race');
    }
     handleSubmit = event => {
        event.preventDefault();
        this.sendNewRaceRequest(this.state.raceid, this.state.tyretype, this.state.tyremix, this.state.term,
            this.state.variant, this.state.number, this.state.orderdate, this.state.ordertime, this.state.pickuptime);
    }

     async sendNewRaceRequest(type,place,date) {
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/race/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type:type,
                    place:place,
                    date:date,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    AsyncStorage.setItem("raceIDNewRace",data[0].id)
                    console.log("changeNav")
                    this.props.navigation.replace("Race");//replace('Race');
                    return parseInt(data[0].id)
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }






        secondsToTime(secs)
        {
            let hours = Math.floor(secs / (60 * 60));
            let divisor_for_minutes = secs % (60 * 60);
            let minutes = Math.floor(divisor_for_minutes / 60);
            let divisor_for_seconds = divisor_for_minutes % 60;
            let seconds = Math.ceil(divisor_for_seconds);
            let obj = {
                "h": hours,
                "m": minutes,
                "s": seconds
            };
            return obj;
        }

        startTimer()
        {
            var hour = 0;
            var minute = 0;
            var second = 0;
            var atime = this.state.timervalue.split(':');
            if (atime[0].length > 0) {
                hour = parseInt(atime[0]);
            }
            if (atime[1].length > 0) {
                minute = parseInt(atime[1]);
            }
            if (atime[2].length > 0) {
                second = parseInt(atime[2]);
            }
            this.state.seconds = stunde * 3600 + minute * 60 + sekunde;

            if (this.state.seconds > 0) {
                this.timer = setInterval(this.countDown, this.state.seconds);
            }
        }

        countDown()
        {
            let seconds = this.state.seconds - 1;
            this.setState({
                time: this.secondsToTime(seconds),
                seconds: seconds,
            });
            // Check if  zero.
            if (seconds == 0) {
                clearInterval(this.timer);
            }
        }

        getTime()
        {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            return h + ":" + m;
        }

        validateForm()
        {
            return this.state.tyretype.length > 0 && this.state.tyremix.length > 0 && this.state.number.length > 0 && this.state.orderdate.length > 0 && this.state.ordertime.length > 0 && this.state.pickuptime.length > 0;
        }


        validateForm1()
        {
            return this.state.timervalue.length > 0;
        }

        render()
        {
            let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
            ));

            return (
                <View style={container1}>
                <View style={{justifyContent: 'flex-start'}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                        Neue Reifenbestellung anlegen
                    </Text>
                    <label style={{fontFamily: 'arial'}}>
                         Wähle das gewünschte Rennen aus:
                        <select value={this.state.id} onChange={this.getRaceID}>
                        {optionTemplate}
                </select>
                </label>
                    <Text style={{height: 10}}> </Text>
                    <table >
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Reifenart: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.tyretype}
                                   onChangeText={(text) => this.setState({tyretype: text})}/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Mischung: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.tyremix}
                                    onChangeText={(text) => this.setState({tyremix: text})}/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bezeichnung: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.term}
                                  onChangeText={(text) => this.setState({term: text})}/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bearbeitungsvariante: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.variant}
                                   onChangeText={(text) => this.setState({variant: text})}/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bestelldatum: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.orderdate}
                                   placeholder='TT.MM.JJJJ' onChangeText={(date) => this.setState({orderdate: date})}/></td>
                    </tr>
                   <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bestellzeit: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.ordertime}
                                   placeholder='SS:MM' onChangeText={(time) => this.setState({ordertime: time})}/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Abholzeit: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.pickuptime}
                                    placeholder='SS:MM' onChangeText={(time) => this.setState({pickuptime: time})}/></td>
                    </tr>
                </table>
                        <Text> </Text>
                        <Button
                            disabled={!this.validateForm()}
                            title="Reifenbestellung anlegen"
                            onPress={this.handleSubmit}
                        />
                        <Text> </Text>
                        <Button
                            title="zurück"
                            onPress={this.changeRace}
                            />
                    </View>
                <View style={{justifyContent: 'flex-start'}}>
                        <Text style={{height: 120}}> </Text>
                    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                        Reifensatz aktuell in Bearbeitung
                    </Text>
                     <table>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Reifenart: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.tyretype}
                                   onChangeText={(text) => this.setState({tyretype: text})}/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Mischung: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.tyremix}
                                    onChangeText={(text) => this.setState({tyremix: text})}/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bearbeitungsvariante: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}><TextInput value={this.state.variant}
                                   onChangeText={(text) => this.setState({variant: text})}/>
                        </td>
                    </tr>
                     </table>
                    <Text style={bigStyle}>
                        Timer Reifenbestellung
                    </Text>
                        <Text style={emptylineStyle}> </Text>
                        <Text style={emptylineStyle}> </Text>
                        <Text style={orderHeaderStyle}> Reifenbestellung abholbereit in: </Text>
                        <TextInput
                            style={orderTextStyle}
                            placeholder=" SS:MM:SS"
                            onChangeText={(time) => this.setState({timervalue: time})}
                        />
                        <Text style={emptylineStyle}> </Text>
                        <button

                            disabled={!this.validateForm1()}
                            onClick={this.startTimer}>Start
                        </button>
                        <Text style={emptylineStyle}> </Text>
                        <Text style={orderFeedbackStyle}>
                            Stunden: {this.state.time.h} Minuten: {this.state.time.m} Sekunden: {this.state.time.s} </Text>
                        <Text style={emptylineStyle}> </Text>
                        <Text style={emptylineStyle}> </Text>
                        <Text style={emptylineStyle}> </Text>
                        <Button
                            title="zurück"
                            onPress={this.changeRace}
                        />
                    </View>
            </View>
            );
        }
    }


    const
    bigStyle = {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold'
    }

    const
    subStyle = {
        fontSize: 20,
        height: 40
    }

    const
    emptylineStyle = {
        height: 20,
    }

    const
    orderHeaderStyle = {
        height: 40,
        width: 300,
        margin: 3,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#696969',
        color: '#ffffff',
        fontweight: 'bold',
        fontSize: 16,
        lineHeight: 16,
        fontfamily: 'arial'
    };

    const
    orderTextStyle = {
        height: 30,
        width: 300,
        margin: 3,
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#d3d3d3',
        fontSize: 14,
        fontfamily: 'arial'
    };

    const
    orderFeedbackStyle = {
        height: 40,
        width: 300,
        margin: 3,
        textAlign: 'center',
        borderWidth: 1,
        padding: 10,
        backgroundColor: '#d3d3d3',
        fontSize: 14
    };
    const container1 ={
        padding: '50px',
        flexDirection: 'row',
    };