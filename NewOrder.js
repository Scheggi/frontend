import React from "react";
import {Button, Text, TextInput, ToastAndroid,ScrollView, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList,changeWheelSet} from "./tools";
import {get_Dict_WheelOrder, getDropdown,getWheelSetInformation} from "./tools_get_wheels";


export default class NewOrderScreen extends React.Component {
   constructor(props) {
        super(props);
        this.state = {
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
            raceid: 0,
            tyretype: '',
            tyremix: '',
            term1: '',
            variant: '',

            //für Tabelle rechts:
            tyretype1: '',
            tyremix1: '',
            variant1: '',
            ordertime: '',
            orderduration: 0,
            raceList: [],

            time: {},
            seconds: 1800,
            timervalue: 0,
        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.fillList= this.fillList.bind(this);
    }


     async componentDidMount(){
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        const raceID = await AsyncStorage.getItem('raceID');
        getDropdown(accesstoken,raceID).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({listDropdown1: racelistDropdown[0]});
            this.setState({listDropdown2: racelistDropdown[1]});
            this.setState({listDropdown3: racelistDropdown[2]});
        }).catch(function (error) {
            console.log(error);
        })
        await this.getWheelDict();
        await this.getDropdownList();
        console.log(this.state.dictButtons)
        if (this.state.dictButtons.length==6){
            this.setState({ButtonSlicks_Cold: 'Slicks Cold  '+this.state.dictButtons[0][0].toString()});
            this.setState({ButtonSlicks_Medium: 'Slicks Medium  '+this.state.dictButtons[1][0].toString()});
            this.setState({ButtonSlicks_Hot: 'Slicks Hot  '+this.state.dictButtons[2][0].toString()});
            this.setState({ButtonInter: 'Inters Intermediate  '+this.state.dictButtons[3][0].toString()});
            this.setState({ButtonRainDryWet: 'Rain DryWet  '+this.state.dictButtons[4][0].toString()});
            this.setState({ButtonRainHeavy: 'Rain HeavyWet  '+this.state.dictButtons[5][0].toString()});

            console.log(this.state.ButtonSlicks_Cold)

        }
        await this.getWheelData()
    }

    //get Wheel Data
    async getWheelDict(){
       const accesstoken = await AsyncStorage.getItem('accesstoken');
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
       const accesstoken = await AsyncStorage.getItem('accesstoken');
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
        this.fillList();
        changeWheelSet(this.state.setID,this.state.variant,this.state.orderduration,this.state.term1);
        AsyncStorage.setItem('orderSetID',this.state.setID);
        this.refresh_Buttons();
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
            var hour = this.state.timervalue /60 ;
            var minute = this.state.timervalue % 60;
            var second = 0;
            this.state.seconds = this.state.timervalue *60;
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
            return this.state.tyretype.length > 0 && this.state.tyremix.length > 0 && this.state.term1.length > 0 && this.state.orderduration > 0 && this.state.variant.length > 0;
        }

        validateForm1()
        {
            return this.state.timervalue.length > 0;
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


        fillList(){
          var date=new Date();
          let hour= date.getHours();
          let minutes=date.getMinutes();
          if((String(hour)).length==1)
             hour='0'+hour;
          if((String(minutes)).length==1)
              minutes='0'+minutes;
          const time=hour+ ':' + minutes;
          //alert(time);
          this.setState({ordertime: time});
          this.setState({variant1: this.state.variant});
          this.setState({tyremix1: this.state.tyremix});
          this.setState({tyretype1: this.state.tyretype});
          this.setState({timervalue: time});
          this.startTimer();
        }

        async getWheelData(){
            //this.setState({wheels: []});
            const accesstoken = await AsyncStorage.getItem('accesstoken');
        const setID = await AsyncStorage.getItem('orderSetID');
        //const raceID = await AsyncStorage.getItem('raceID');
        console.log(setID)
        await getWheelSetInformation(accesstoken, setID).then(DataTabular => {
            console.log(DataTabular);
            this.setState({SetInformation: DataTabular});
            this.setState({wheels: [this.state.SetInformation]});
            //this.state.wheels.push(this.state.SetInformation);
        }).catch(function (error) {
            console.log(error);
        })
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
                else {console.log("failed")}
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


        handleTemp = event => {
            timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel/set_temp', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    set_id: event.target.id,
                    temp_air: event.target.value,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    console.log("temp Changed")
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
                return (
                    <tr bgcolor='white' style={{border: "solid", borderColor: 'grey',textAlign: "center", padding: '8px', color: 'black', fontFamily: 'arial'}}  key={wheel.setid}>
                        <td style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}> {wheel.setNr} </td>
                        <td style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}> {wheel.status} </td>
                        <td style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}> {wheel.cat} </td>
                        <td style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}><input id ={wheel.subcat} placeholder={wheel.subcat} value={wheel.subcat} /></td>
                        <td style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}><input id={wheel.setid}  placeholder={'Temperatur'} onChange={this.handleTemp} value={wheel.temp}/></td>
                        <td style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}><input id={wheel.fl_id} placeholder={'FL ID'} onChange={this.handleWheelIDChange} value={wheel.fl_wheel_id}/><input id={wheel.fr_id} placeholder={'FR ID'}  onChange={this.handleWheelIDChange} value={wheel.fr_wheel_id}/><input id={wheel.bl_id} placeholder={'BL ID'} onChange={this.handleWheelIDChange} value={wheel.bl_wheel_id}/><input id={wheel.br_id} placeholder={'BR ID '} onChange={this.handleWheelIDChange} value={wheel.br_wheel_id}/></td>
                        <td style={{border: "solid", borderColor: 'grey', height: 25, width: 150, padding: '8px',textAlign: 'center'}}><input id={wheel.fl_id} placeholder={'FL Luftdruck'} onChange={this.handleAirPressureChange} value={wheel.fl_pressure}/><input id={wheel.fr_id} placeholder={'FR Luftdruck'} onChange={this.handleAirPressureChange}  value={wheel.fr_pressure}/><input id={wheel.bl_id} placeholder={'BL Luftdruck'} onChange={this.handleAirPressureChange} value={wheel.bl_pressure}/><input id={wheel.br_id}  placeholder={'BR Luftdruck'} onChange={this.handleAirPressureChange} value={wheel.br_pressure}/></td>
                    </tr>
                )
            })
        }

        render()
        {
            return (
                <ScrollView>
                <View style={container1}>
                    <View style={container2}>
                         <View>
                        <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                        Neue Reifenbestellung anlegen
                    </Text>
                        </View>
                        <View style={{textAlign: 'center'}}>
                            <Text> </Text>
                            <Text stlye={{fontfamily: 'arial', fontSize: 16}}>
                            Reifentyp auswählen:
                            </Text>
                            <Text style={{height: 5}}> </Text>
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
                        </View>
                        <View>
                            <Text style={{height: 5}}> </Text>
                        </View>
                        <View style={container4}>
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
                <View >
                    <Text style={{height: 20}}> </Text>
                    <table >
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Reifenart: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 300, padding: '8px'}}><TextInput style={{textAlign: 'left', height: 20, width: 250, fontFamily: 'arial'}} value={this.state.tyretype}
                                   onChangeText={(text) => this.setState({tyretype: text})}/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Mischung: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 300, padding: '8px'}}> <TextInput style={{textAlign: 'left', height: 20, width: 250, fontFamily: 'arial'}} value={this.state.tyremix}
                                    onChangeText={(text) => this.setState({tyremix: text})}/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bezeichnung: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 300, padding: '8px'}}><TextInput style={{textAlign: 'left', height: 20, width: 250, fontFamily: 'arial'}} value={this.state.term1}
                                  onChangeText={(text) => this.setState({term1: text})}/></td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Bearbeitungsvariante: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 300, padding: '8px'}}><TextInput style={{textAlign: 'left', height: 20, width: 250, fontFamily: 'arial'}} value={this.state.variant}
                                   onChangeText={(text) => this.setState({variant: text})}/>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor='#696969' style={{textAlign: "left", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}><label> Abholdauer: </label></td>
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 300, padding: '8px'}}><TextInput style={{textAlign: 'left', height: 20, width: 250, fontFamily: 'arial'}} value={this.state.orderduration}
                                   placeholder=" Zeit in Minuten" onChangeText={(text) => {this.setState({orderduration: text}); this.setState({timervalue: text})}}/>
                        </td>
                    </tr>
                </table>
                        <View style={{marginLeft: 'auto', marginRight: 'auto', width: 200}}>
                        <Text style={{height: 20}}> </Text>
                        <Button
                            disabled={!this.validateForm()}
                            title="Bestellung bestätigen"
                            onPress={this.handleSubmit}
                        />
                        <Text> </Text>
                        <Button
                            title="zurück"
                            onPress={this.changeRace}
                            />
                        </View>
                    </View>
                        </View>
                <View style={{justifyContent: 'flex-start'}}>
                    <View style={container3}>
                    <View>
                    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                        Reifensatz in Bearbeitung
                    </Text>
                     <Text> </Text>
                    </View>
                    <View>
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
                        <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}}>{this.state.ordertime}
                        </td>
                    </tr>
                    <tr style={{height: 50}}>
                        <td> </td>
                        <td></td>
                    </tr>
                     </table>
                    </View>
                     <View >
                    <Text style={{color: 'black', fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>
                        Reifen abholbereit in:
                    </Text>
                     <Text> </Text>
                     </View>
                        <View style={{textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
                        <Text style={orderFeedbackStyle}>
                            {this.state.time.h} Stunden {this.state.time.m} Minuten {this.state.time.s} Sekunden </Text>
                     </View>
                </View>
                    </View>
            </View>

                    <div>
                <h1 id='title'>Reifen bearbeiten</h1>
                <table  id='list_formel'>
                   <tbody>
                        <tr>
                        {this.renderWheelTable()}
                        </tr>
                    </tbody>
                </table>
                </div>
                </ScrollView>
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
        fontfamily: 'arial',
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
        fontfamily: 'arial',
        textAlign: 'center'
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