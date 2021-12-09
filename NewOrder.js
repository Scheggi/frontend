import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList,changeWheelSet} from "./tools";
import {get_Dict_WheelOrder, getDropdown} from "./tools_get_wheels";


export default class NewOrderScreen extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
            raceid: 0,
            tyretype: '',
            tyremix: '',
            term: '',
            variant: '',
            tyretype1: '',
            tyremix1: '',
            variant1: '',
            number: '',
            orderdate: '',
            ordertime: '',
            ordertime1: '',
            pickuptime: '',
            raceList: [],
            time: {},
            seconds: 1800,
            timervalue: "",
            wheels: [],
            listDropdown1:[],
            listDropdown2:[],
            listDropdown3:[],
            dictButtons:[],
        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }


    // get Data
    async componentDidMount(){
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        getDropdown(accesstoken,raceID).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({listDropdown1: racelistDropdown[0]});
            this.setState({listDropdown2: racelistDropdown[1]});
            this.setState({listDropdown3: racelistDropdown[2]});
        }).catch(function (error) {
            console.log(error);
        })

       console.log(2)
        this.getWheelDict();
        this.getDropdownList();
    }

    //get Wheel Data
    async getWheelDict(){
       const accesstoken = await AsyncStorage.getItem('acesstoken');
       const raceID = await AsyncStorage.getItem('raceID');
       //const raceID = await AsyncStorage.getItem('raceID');
       console.log(raceID)
       await get_Dict_WheelOrder(accesstoken, raceID).then(DataTabular => {
                console.log(DataTabular);
                this.setState({dictButtons: DataTabular});
            }).catch(function (error) {
                console.log(error);
            })
        console.log(this.state.dictButtons)
    }
    // get Dropdown list free,order,used
    async getDropdownList(){
       const accesstoken = await AsyncStorage.getItem('acesstoken');
       const raceID = await AsyncStorage.getItem('raceID');
       //const raceID = await AsyncStorage.getItem('raceID');
       console.log(raceID)
       await getDropdown(accesstoken, raceID).then(DataTabular => {
                console.log(DataTabular);
                this.setState({listDropdown: DataTabular});
            }).catch(function (error) {
                console.log(error);
            })
        console.log(this.state.listDropdown)
    }

    async getSetID(event){
        AsyncStorage.setItem("SetID",event.target.value);
        const setid = await AsyncStorage.getItem("SetID");
        console.log(setid);
    }




    getRaceID = event => {
        const id = event.target.value;
        AsyncStorage.setItem("raceIDHelper", event.target.value);
        this.saveRaceIDinState();
    }

    async saveOrderWheel(){
       const IdWheel = await AsyncStorage.getItem('OrderWheelID');
       changeWheelSet(IdWheel,this.state.ordertime,this.state.variant);
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.replace('Race');
    }
     handleSubmit = event => {
        event.preventDefault();
        changeWheelSet()
        this.saveOrderWheel();
         //this.sendNewRaceRequest(this.state.raceid, this.state.tyretype, this.state.tyremix, this.state.term,
        //    this.state.variant, this.state.number, this.state.orderdate, this.state.ordertime, this.state.pickuptime);
    }
     handleSubmitButton1 = event => {
        event.preventDefault();
        this.setState({tyretype: "Slicks"});
        this.setState({tyremix: "Cold"});
    }
    handleSubmitButton1 = event => {
        event.preventDefault();
        this.setState({tyretype: "Slicks"});
        this.setState({tyremix: "Cold"});
    }
    handleSubmitButton2 = event => {
        event.preventDefault();
        this.setState({tyretype: "Slicks"});
        this.setState({tyremix: "Medium"});
    }
    handleSubmitButton3 = event => {
        event.preventDefault();
        this.setState({tyretype: "Slicks"});
        this.setState({tyremix: "Hot"});
    }
    handleSubmitButton4 = event => {
        event.preventDefault();
        this.setState({tyretype: "Inters"});
        this.setState({tyremix: "Intermediate"});
    }
    handleSubmitButton5 = event => {
        event.preventDefault();
        this.setState({tyretype: "Rain"});
        this.setState({tyremix: "Dry Wet"});
    }
    handleSubmitButton6 = event => {
        event.preventDefault();
        this.setState({tyretype: "Rain"});
        this.setState({tyremix: "Heavy Wet"});
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

        async getWheelData(){
            this.setState({wheels: []});
            //TODO: Datenabruf implementieren
            this.state.wheels.push({
                setid: setid,
                status: status,
                cat: cat,
                subcat: subcat,
                fl_id: fl_id,
                fl_pressure,
                fl_wheel_id,
                fl_wheel_edit,
                fr_id: fr_id,
                fr_pressure,
                fr_wheel_id,
                fr_wheel_edit,
                bl_id: bl_id,
                bl_pressure,
                bl_wheel_id,
                bl_wheel_edit,
                br_id: br_id,
                br_pressure,
                br_wheel_id,
                br_wheel_edit,
            })
        }

        handleAirPressureChange = event => {
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel_cont/change_air_pressWheel', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: event.target.id,
                    air_press: event.target.value,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("Pressure Changed")
                    this.getWheelData().then(() => {return})
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
        }

        handleWheelIDChange = event => {
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel/set_id_tag', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wheel_id: event.target.id,
                    wheel_id_tag: event.target.value,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("ID Changed")
                    this.getWheelData().then(() => {return})
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
        }

        handleWheelEditChange = event => {
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel/set_edit', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wheel_id: event.target.id,
                    wheel_edit: event.target.value,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("Edit Changed")
                    this.getWheelData().then(() => {return})
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
        }

        renderWheelTable(){
            return this.state.wheels.map((wheel) => {
                return (
                    <tr>
                        <td>{wheel.setid}</td>
                        <td>{wheel.status}</td>
                        <td>{wheel.cat}</td>
                        <td>{wheel.subcat}</td>
                        <td><input id={wheel.fl_id} onChange={this.handleAirPressureChange}>{this.wheel.fl_pressure}</input><input id={wheel.fr_id} onChange={this.handleAirPressureChange}>{this.wheel.fr_pressure}</input><input id={wheel.bl_id} onChange={this.handleAirPressureChange}>{this.wheel.bl_pressure}</input><input id={wheel.br_id} onChange={this.handleAirPressureChange}>{this.wheel.br_pressure}</input></td>
                        <td><input id={wheel.fl_id} onChange={this.handleWheelIDChange}>{this.wheel.fl_wheel_id}</input><input id={wheel.fr_id} onChange={this.handleWheelIDChange}>{this.wheel.fr_wheel_id}</input><input id={wheel.bl_id} onChange={this.handleWheelIDChange}>{this.wheel.bl_wheel_id}</input><input id={wheel.br_id} onChange={this.handleWheelIDChange}>{this.wheel.br_wheel_id}</input></td>
                        <td><input id={wheel.fl_id} onChange={this.handleWheelEditChange}>{this.wheel.fl_wheel_edit}</input><input id={wheel.fr_id} onChange={this.handleWheelEditChange}>{this.wheel.fr_wheel_edit}</input><input id={wheel.bl_id} onChange={this.handleWheelEditChange}>{this.wheel.bl_wheel_edit}</input><input id={wheel.br_id} onChange={this.handleWheelEditChange}>{this.wheel.br_wheel_edit}</input></td>
                    </tr>
                )
            })
        }

        render()
        {
            let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
            ));

            return (
                <View style={container2}>
                    <View style={container3}>
                        <View style={container5}>
                        <Text style={{fontSize: 40, fontWeight: 'bold', textAlign: 'center'}}>
                        Neue Reifenbestellung anlegen
                    </Text>
                        </View>
                        <View style={container4}>
                            <Button
                            //disabled={!this.validateFormButton1()}
                            title="Slicks Cold"
                            onPress={this.handleSubmitButton1}
                        />
                        <Button
                            //disabled={!this.validateFormButton2()}
                            title="Slicks Medium"
                            onPress={this.handleSubmitButton2}
                        />
                        <Button
                            //disabled={!this.validateFormButton3()}
                            title="Slicks Hot"
                            onPress={this.handleSubmitButton3}
                        />
                        <Button
                            //disabled={!this.validateFormButton4()}
                            title="Inters Intermediate"
                            onPress={this.handleSubmitButton4}
                        />
                        <Button
                            //disabled={!this.validateFormButton5()}
                            title="Rain Dry Wet"
                            onPress={this.handleSubmitButton5}
                        />
                        <Button
                            //disabled={!this.validateFormButton6()}
                            title="Rain Heavy Wet"
                            onPress={this.handleSubmitButton6}
                        />

                        </View>
                    </View>
                <View style={container1}>
                <View style={{justifyContent: 'flex-start'}}>
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
                </table>
                        <Text> </Text>
                        <Button
                            disabled={!this.validateForm()}
                            title="Reifenbestellung bestätigen"
                            onPress={this.handleSubmit}
                        />
                        <Text> </Text>
                        <Button
                            title="zurück"
                            onPress={this.changeRace}
                            />
                    </View>
                <View style={{justifyContent: 'flex-start'}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                        Reifensatz aktuell in Bearbeitung
                    </Text>
                     <table>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Reifenart: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>{this.state.tyretype1}</td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Mischung: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>{this.state.tyremix1}</td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bearbeitungsvariante: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>{this.state.variant1}
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bestellzeit: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>{this.state.ordertime1}
                        </td>
                    </tr>
                     </table>
                    <Text style={{height: '10'}}></Text>
                    <Text style={bigStyle}>
                        Timer
                    </Text>
                        <Text style={orderHeaderStyle}> Reifenbestellung abholbereit in: </Text>
                        <TextInput
                            style={orderTextStyle}
                            placeholder=" SS:MM:SS"
                            onChangeText={(time) => this.setState({timervalue: time})}
                        />
                        <button style={{width:300}}

                            disabled={!this.validateForm1()}
                            onClick={this.startTimer}>Start
                        </button>
                        <Text style={orderFeedbackStyle}>
                            Stunden: {this.state.time.h} Minuten: {this.state.time.m} Sekunden: {this.state.time.s} </Text>
                    </View>
            </View>
            <View>
                <table>
                    <tbody>
                        <tr>
                            <td>Setnumber</td>
                            <td>Status</td>
                            <td>Cat</td>
                            <td>SubCat</td>
                            <td>Air Pressure</td>
                            <td>Wheel ID</td>
                            <td>Wheel Edit</td>
                        </tr>
                        {this.renderWheelTable()}
                    </tbody>
                </table>
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
        justifyContent: 'space-around',
    };
    const container2={

    };
    const container3={


    };
    const container4={
        flexDirection: 'row',
        justifyContent: 'space-evenly',

    };
    const container5={
        textAlign: 'center',
        padding: '20px',

    };