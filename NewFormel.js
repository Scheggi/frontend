import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData, getRaceList,getFormelList} from "./tools";

export default class NewFormelScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceList:[],
            raceID: -1,
            variable1: "",
            variable2: "",
            variable3: "",
            variable4: "",
            air_pressureFL: "",
            air_pressureFR: "",
            air_pressureBL: "",
            air_pressureBR: "",
            airTemperature: "",
            trackTemperature: "",
        }
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    validateForm() {
        return this.state.raceID!=-1&&this.state.variable1!=""&&this.state.variable2!=""&&this.state.variable3!=""&&this.state.variable4!="";

    }
    validateForm1(){
        return this.state.raceID!=-1&&this.state.airTemperature!=""&&this.state.trackTemperature!=""&&this.state.air_pressureFL!=""&&this.state.air_pressureFR!=""&&this.state.air_pressureBL!=""&&this.state.air_pressureBR!="";
    }
    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state.raceID);
        console.log(this.state.variable1);
        console.log(this.state.variable2);
        console.log(this.state.variable3);
        console.log(this.state.variable4);

    }

     handleSubmit1 = event => {
        event.preventDefault();
        console.log(this.state.airTemperature);
        console.log(this.state.trackTemperature);
        console.log(this.state.air_pressureFL);
        console.log(this.state.air_pressureFR);
        console.log(this.state.air_pressureBL);
        console.log(this.state.air_pressureBR);


    }



    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        getRaceList(accesstoken).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({raceList: racelistDropdown});
        }).catch(function (error) {
            console.log(error);
        });
        }
 getRaceID = event =>{
        const id = event.target.value;
         console.log(id);
        this.setState({raceID: id});
    }
 handleChangeVariable1 = event => {
    event.preventDefault();
    this.setState({variable1: event.target.value});
 }
handleChangeVariable2 = event => {
    event.preventDefault();
    this.setState({variable2: event.target.value});
 }

handleChangeVariable3 = event => {
    event.preventDefault();
    this.setState({variable3: event.target.value});
 }

handleChangeVariable4 = event => {
    event.preventDefault();
    this.setState({variable4: event.target.value});
 }
handleChangeAirTemperature= event => {
    event.preventDefault();
    this.setState({airTemperature: event.target.value});
 }
handleChangeTrackTemperature= event => {
    event.preventDefault();
    this.setState({trackTemperature: event.target.value});
 }
handleChangeAirPressureFL= event => {
    event.preventDefault();
    this.setState({ air_pressureFL: event.target.value});
 }
handleChangeAirPressureFR= event => {
    event.preventDefault();
    this.setState({ air_pressureFR: event.target.value});
 }
handleChangeAirPressureBL= event => {
    event.preventDefault();
    this.setState({ air_pressureBL: event.target.value});
 }
 handleChangeAirPressureBR= event => {
    event.preventDefault();
    this.setState({ air_pressureBR: event.target.value});
 }

    render() {
     let optionTemplate = this.state.raceList.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>

    ));

     return(
         <View style={{ overflowY: 'scroll', flex:1}}>
             <div className="container" >
         <h1>Formel und Kaltdruck-Orientierungswerte eintragen</h1>
           <div className="input-group" style={{width:'70%'}}>
              <span className="input-group-text">Rennen auswählen:</span>
            <select  id='option' style={{margin: 10, fontFamily: 'arial'}} value={this.state.id} onChange={this.getRaceID}>{optionTemplate}</select>
           </div>
             <br></br>
             <div className="alert alert-secondary" role="alert">
                 Pa = angegebener Kaltdruck, Tg = gemessene Temperatur, Ta = angegebene Temperatur
             </div>
           <div className="input-group" style={{width:'70%'}}>
                 <span className="input-group-text">Pa*(Tg+</span>
                 <input type="text" className="form-control"  aria-label="Server"  onChange={this.handleChangeVariable1} value={this.state.variable1}></input>
                  <span className="input-group-text">)/(Ta+</span>
                 <input type="text" className="form-control"  aria-label="Server"  onChange={this.handleChangeVariable2} value={this.state.variable2}></input>
                 <span className="input-group-text">)+(</span>
                  <input type="text" className="form-control"  aria-label="Server" onChange={this.handleChangeVariable3} value={this.state.variable3}></input>
                  <span className="input-group-text">)*(Tg-Ta)/(Ta+</span>
                 <input type="text" className="form-control"  aria-label="Server"  onChange={this.handleChangeVariable4} value={this.state.variable4}></input>
                 <span className="input-group-text">)</span>
                 <button disabled={!this.validateForm()} type="button" className="btn btn-primary" onClick={this.handleSubmit}>Formel speichern</button>
             </div>
             <br></br>
             <div className="row g-3">
             <div className="col-md-6">
                 <label  className="form-label">Air Temperature</label>
                 <input type="text" className="form-control" value={this.state.airTemperature} onChange={this.handleChangeAirTemperature}></input>
             </div>
             <div className="col-md-6">
                 <label className="form-label">Track Temperature</label>
                 <input type="text" className="form-control"  value={this.state.trackTemperature} onChange={this.handleChangeTrackTemperature} required></input>
             </div>
              <div className="col-md-6">
                 <label className="form-label">Cold TP</label>
                 <input type="text" className="form-control"  placeholder=" air_pressureFL" value={this.state.air_pressureFL} onChange={this.handleChangeAirPressureFL} required></input>
                  <input type="text" className="form-control"  placeholder=" air_pressureFR" value={this.state.air_pressureFR} onChange={this.handleChangeAirPressureFR} required></input>
                   <input type="text" className="form-control"   placeholder=" air_pressureBL" value={this.state.air_pressureBL} onChange={this.handleChangeAirPressureBL} required></input>
                   <input type="text" className="form-control"  placeholder=" air_pressureBR" value={this.state.air_pressureBR} onChange={this.handleChangeAirPressureBR} required></input>
             </div>
               <div className="col-12">
               <button disabled={!this.validateForm1()} type="button" className="btn btn-primary" onClick={this.handleSubmit1}>Daten speichern</button>
               </div>
             </div>
             </div>
             <Button
                        title="zurück"
                        onPress={this.changeRace}
                />
        </View>

        );
    }
}
