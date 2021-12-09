import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList,changeWheelSet} from "./tools";
import {get_Dict_WheelOrder, getDropdown,getWheelSetInformation} from "./tools_get_wheels";


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
            orderduration: 0,
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
            ButtonSlicks_Cold: 'Slicks Cold',
            ButtonSlicks_Medium: 'Slicks Medium',
            ButtonSlicks_Hot: 'Slicks Hot',
            ButtonInter: 'Inters Intermediate',
            ButtonRainDryWet: 'Rain DryWet',
            ButtonRainHeavy: 'Rain HeavyWet',
            setID :0,
            SetInformation:{},
            test_setid:0,
            test_list :[],

        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    changeMain(){
        this.props.navigation.goBack();
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
        await this.getWheelDict();
        await this.getDropdownList();
        if (this.state.dictButtons.length==6){
            console.log(this.state.dictButtons)
            console.log([this.state.dictButtons[0][0],this.state.dictButtons[1][0],this.state.dictButtons[5][0]])
            this.setState({ButtonSlicks_Cold: 'Slicks Cold  '+this.state.dictButtons[0][0].toString()});
            this.setState({ButtonSlicks_Medium: 'Slicks Medium  '+this.state.dictButtons[1][0].toString()});
            this.setState({ButtonSlicks_Hot: 'Slicks Hot  '+this.state.dictButtons[2][0].toString()});
            this.setState({ButtonInter: 'Inters Intermediate  '+this.state.dictButtons[3][0].toString()});
            this.setState({ButtonRainDryWet: 'Rain DryWet  '+this.state.dictButtons[4][0].toString()});
            this.setState({ButtonRainHeavy: 'Rain HeavyWet  '+this.state.dictButtons[5][0].toString()});

            console.log(this.state.ButtonSlicks_Cold)

        }
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

    async openTabular(){
       await this.getSetInformation();
       this.getWheelData();
       this.renderWheelTable();
    }

    // get Set Information
    async getSetInformation(){
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const setID = await AsyncStorage.getItem('orderSetID');
        //const raceID = await AsyncStorage.getItem('raceID');
        console.log(setID)
        await getWheelSetInformation(accesstoken, setID).then(DataTabular => {
            console.log(DataTabular);
            this.setState({SetInformation: DataTabular});
        }).catch(function (error) {
            console.log(error);
        })

    }

    async getSetID(event){
        AsyncStorage.setItem("SetIDDropdown",event.target.value);
        const setid = await AsyncStorage.getItem("SetID");
        console.log(setid);
    }


    getRaceID = event => {
        const id = event.target.value;
        AsyncStorage.setItem("raceIDHelper", event.target.value);
        this.saveRaceIDinState();
    }



    refresh_Buttons(){
        if (this.state.dictButtons.length==6) {
            this.setState({ButtonSlicks_Cold: 'Slicks Cold  ' + this.state.dictButtons[0][0].toString()});
            this.setState({ButtonSlicks_Medium: 'Slicks Medium  ' + this.state.dictButtons[1][0].toString()});
            this.setState({ButtonSlicks_Hot: 'Slicks Hot  ' + this.state.dictButtons[2][0].toString()});
            this.setState({ButtonInter: 'Inters Intermediate  ' + this.state.dictButtons[3][0].toString()});
            this.setState({ButtonRainDryWet: 'Rain DryWet  ' + this.state.dictButtons[4][0].toString()});
            this.setState({ButtonRainHeavy: 'Rain HeavyWet  ' + this.state.dictButtons[5][0].toString()});
        }
        }


    changeRace = event => {
        event.preventDefault();
        this.props.navigation.replace('Race');
    }
     handleSubmit = event => {
        event.preventDefault();
        changeWheelSet(this.state.setID,this.state.variant,this.state.orderduration,this.state.term);
        AsyncStorage.setItem('orderSetID',this.state.setID);
        this.refresh_Buttons();
        this.openTabular();
    }


    handleSubmitButton1 = event => {
        event.preventDefault();
        this.setState({tyretype: "Slicks"});
        this.setState({tyremix: "Cold"});
        let helper = this.state.dictButtons;
        helper[0][0]= helper[0][0]-1;
        this.setState({setID:helper[0][0]});
        this.setState({dictButtons:helper});
    }
    handleSubmitButton2 = event => {
        event.preventDefault();
        this.setState({tyretype: "Slicks"});
        this.setState({tyremix: "Medium"});
        let helper = this.state.dictButtons;
        helper[1][0]= helper[1][0]-1;
        this.setState({setID: helper[1][1][helper[1][0]]});
        this.setState({dictButtons: helper});


    }
    handleSubmitButton3 = event => {
        event.preventDefault();
        this.setState({tyretype: "Slicks"});
        this.setState({tyremix: "Hot"});
        let helper = this.state.dictButtons;
        helper[2][0]= helper[2][0]-1;
        const index = helper[2][0]
        this.setState({setID:helper[2][1][index]});
        this.setState({dictButtons:helper});
    }
    handleSubmitButton4 = event => {
        event.preventDefault();
        this.setState({tyretype: "Inters"});
        this.setState({tyremix: "Intermediate"});
        let helper = this.state.dictButtons;
        helper[3][0]= helper[3][0]-1;
        const index = helper[3][0]
        this.setState({setID:helper[3][1][index]});
        this.setState({dictButtons:helper});
    }
    handleSubmitButton5 = event => {
        event.preventDefault();
        this.setState({tyretype: "Rain"});
        this.setState({tyremix: "Dry Wet"});
        let helper = this.state.dictButtons;
        helper[4][0]= helper[4][0]-1;
        const index = helper[4][0]
        this.setState({setID:helper[4][1][index]});
        this.setState({dictButtons:helper});
    }
    handleSubmitButton6 = event => {
        event.preventDefault();
        this.setState({tyretype: "Rain"});
        this.setState({tyremix: "Heavy Wet"});
        let helper = this.state.dictButtons;
        helper[5][0]= helper[5][0]-1;
        const index = helper[5][0]
        this.setState({setID:helper[5][1][index]});
        this.setState({dictButtons:helper});
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
            return this.state.orderduration.length > 0 && this.state.variant.length > 0 ;
        }

        validateFormButton1(){
       return this.state.dictButtons.length==6 && this.state.dictButtons[0][0]>0;
        }
        validateFormButton2(){
       return this.state.dictButtons.length==6 &&this.state.dictButtons[1][0]>0;
        }
        validateFormButton3(){
       return this.state.dictButtons.length==6 && this.state.dictButtons[2][0]>0;
        }
        validateFormButton4(){
       return this.state.dictButtons.length==6 && this.state.dictButtons[3][0]>0;
        }validateFormButton5(){
       return this.state.dictButtons.length==6 && this.state.dictButtons[4][0]>0;
        }validateFormButton6(){
       return this.state.dictButtons.length==6 && this.state.dictButtons[5][0]>0;
        }



        validateForm1()
        {
            return this.state.timervalue.length > 0;
        }

        async getWheelData(){
            this.setState({wheels: []});
            this.state.wheels.push(this.state.SetInformation);
            console.log(this.state.wheels)
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


        renderWheelTable(){
            return this.state.wheels.map((wheel,) => {
                console.log(wheel);
                console.log(wheel.setid)
                return (
                    <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}} key={wheel.setid}>
                        <td>{wheel.setid}</td>
                        <td>{wheel.status}</td>
                        <td>{wheel.cat}</td>
                        <td>{wheel.subcat}</td>
                        <td> input id ={wheel.temp} on Change={}</td>
                        <td><input id={wheel.fl_id} onChange={this.handleAirPressureChange}>{wheel.fl_pressure}</input><input id={wheel.fr_id} onChange={this.handleAirPressureChange}>{wheel.fr_pressure}</input><input id={wheel.bl_id} onChange={this.handleAirPressureChange}>{wheel.bl_pressure}</input><input id={wheel.br_id} onChange={this.handleAirPressureChange}>{wheel.br_pressure}</input></td>
                        <td><input id={wheel.fl_id} onChange={this.handleWheelIDChange}>{wheel.fl_wheel_id}</input><input id={wheel.fr_id} onChange={this.handleWheelIDChange}>{wheel.fr_wheel_id}</input><input id={wheel.bl_id} onChange={this.handleWheelIDChange}>{wheel.bl_wheel_id}</input><input id={wheel.br_id} onChange={this.handleWheelIDChange}>{wheel.br_wheel_id}</input></td>
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
                            disabled={!this.validateFormButton1()}
                            title= {this.state.ButtonSlicks_Cold}
                            onPress={this.handleSubmitButton1}
                        />
                        <Button
                            disabled={!this.validateFormButton2()}
                            title= {this.state.ButtonSlicks_Medium}
                            onPress={this.handleSubmitButton2}
                        />
                        <Button
                            disabled={!this.validateFormButton3()}
                            title= {this.state.ButtonSlicks_Hot}
                            onPress={this.handleSubmitButton3}
                        />
                        <Button
                            disabled={!this.validateFormButton4()}
                            title={this.state.ButtonInter}
                            onPress={this.handleSubmitButton4}
                        />
                        <Button
                            disabled={!this.validateFormButton5()}
                            title= {this.state.ButtonRainDryWet}
                            onPress={this.handleSubmitButton5}
                        />
                        <Button
                            disabled={!this.validateFormButton6()}
                            title={this.state.ButtonRainHeavy}
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
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bestelldauer: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}> <TextInput value={this.state.orderduration}
                                   placeholder='TT.MM.JJJJ' onChangeText={(date) => this.setState({orderduration: date})}/></td>
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


                    <div>
                <h1 id='title'>Reifen bearbeiten</h1>
                <table  id='list_formel'>
                   <tbody>
                        {this.renderWheelTable()}
                    </tbody>
                </table>
                </div>

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