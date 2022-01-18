import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData, getRaceList, getFormelList, getWeatherTab} from "./tools";
//import image from './logo.png';
import {getDropdown,getWheelSetInformation} from "./tools_get_wheels";

export default class AstridScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceID: -1,
            variable1: 0,
            variable2: 0,
            variable3: 0,
            variable4: 0,
            air_pressureFL: 0,
            air_pressureFR: 0,
            air_pressureBL: 0,
            air_pressureBR: 0,
            air_pressureFL1: "",
            air_pressureFR1: "",
            air_pressureBL1: "",
            air_pressureBR1: "",
            airTemperature: 0,
            airTemperatureUpdate: "",
            trackTemperature: 0,
            trackTemperatureUpdate:"",
            //Bleed der die Streckentemperatur berücksichtigt
            bleed1:0,
            bleedString1:"",
            //bleed der Streckentemperatur und Heiztemperatur berücksichtigt
            bleed2:0,
            bleedString2: "",
            anpassungsKonstante: "",
            heizTemperatur: "",
            dataDropdown:[],
            wheelSetInformation: [],
            setID: 0,
        }
        this.getSetID=this.getSetID.bind(this);
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    changeLogout = event => {
        event.preventDefault();
        this.props.navigation.replace('Logout');
    }

     changeNewUser = event => {
        event.preventDefault();
        this.props.navigation.push('NewUser');
    }

    changeShowRace = event => {
        event.preventDefault();
        this.props.navigation.push('ShowRace');
    }

    changeNewOrder = event => {
        event.preventDefault();
        this.props.navigation.push('NewOrder');
    }

    changeWeather = event => {
        event.preventDefault();
        this.props.navigation.push('Weather');
    }

    changeNewRace = event => {
        event.preventDefault();
        this.props.navigation.push('NewRace');
    }

     changeWheel = event => {
        event.preventDefault();
        this.props.navigation.push('Wheel');
    }

    changeNewFormel = event => {
        event.preventDefault();
        this.props.navigation.push('NewFormel');
    }

    changeNiklas = event => {
        event.preventDefault();
        this.props.navigation.push('Niklas');
    }

    changeMaen = event => {
        event.preventDefault();
        this.props.navigation.push('Maen');
    }


    validateForm() {
       return this.state.airTemperatureUpdate!="";
    }
    validateForm1(){
        return this.state.heizTemperatur!=""&&this.state.anpassungsKonstante!=""&&this.state.airTemperatureUpdate!=""&&this.state.trackTemperatureUpdate!="" && this.state.air_pressureFL1!=""&&this.state.air_pressureFR1!=""&&this.state.air_pressureBL1!=""&&this.state.air_pressureBR1!="";

    }

    handleSubmit = event => {
        event.preventDefault();
       const airTemperatureUpdate= parseFloat(this.state.airTemperatureUpdate);
       const airTemperature= parseFloat(this.state.airTemperature);
       const variable1= parseFloat(this.state.variable1);
       const variable2= parseFloat(this.state.variable2);
       const variable3= parseFloat(this.state.variable3);
       const variable4= parseFloat(this.state.variable4);
       const air_pressureFL= parseFloat(this.state.air_pressureFL);
       const air_pressureFR= parseFloat(this.state.air_pressureFR);
       const air_pressureBL= parseFloat(this.state.air_pressureBL);
       const air_pressureBR= parseFloat(this.state.air_pressureBR);

       const wert1FL= air_pressureFL*(airTemperatureUpdate+variable1);
       const wert2FL=parseFloat(wert1FL/(airTemperature+variable2)).toFixed(4);
       const wert3=variable3*(airTemperatureUpdate-airTemperature);
       const wert4=airTemperature+variable4;
       const wert5=parseFloat(wert3/wert4).toFixed(4);
       const FL=parseFloat(parseFloat(wert2FL)+parseFloat(wert5)).toFixed(3);

       const wert1FR= air_pressureFR*(airTemperatureUpdate+variable1);
       const wert2FR=parseFloat(wert1FR/(airTemperature+variable2)).toFixed(4);
       const FR=parseFloat(parseFloat(wert2FR)+parseFloat(wert5)).toFixed(3);

       const wert1BL= air_pressureBL*(airTemperatureUpdate+variable1);
       const wert2BL=parseFloat(wert1BL/(airTemperature+variable2)).toFixed(4);
       const BL=parseFloat(parseFloat(wert2BL)+parseFloat(wert5)).toFixed(3);

       const wert1BR= air_pressureBR*(airTemperatureUpdate+variable1);
       const wert2BR=parseFloat(wert1BR/(airTemperature+variable2)).toFixed(4);
       const BR=parseFloat(parseFloat(wert2BR)+parseFloat(wert5)).toFixed(3);

      console.log(FL);
      console.log(FR);
      console.log(BL);
      console.log(BR);

       this.setState({air_pressureFL1: FL});
       this.setState({air_pressureFR1: FR});
       this.setState({air_pressureBL1: BL});
       this.setState({air_pressureBR1: BR});
    }

     handleSubmit1 = event => {
        event.preventDefault();
        const bleed1= parseFloat(this.state.anpassungsKonstante)*(parseFloat(this.state.trackTemperatureUpdate)-parseFloat(this.state.trackTemperature));
        const bleedZwischenwert1= parseFloat(bleed1*(parseFloat(this.state.heizTemperatur)+parseFloat(this.state.variable1))/(parseFloat(this.state.airTemperatureUpdate)+parseFloat(this.state.variable2))).toFixed(3);
        console.log(bleedZwischenwert1);
        const bleedZwischenwert3=parseFloat(parseFloat(this.state.variable3)*(parseFloat(this.state.heizTemperatur)-parseFloat(this.state.airTemperatureUpdate))/(parseFloat(this.state.airTemperatureUpdate)+parseFloat(this.state.variable4))).toFixed(3);
        const bleed2= parseFloat(parseFloat(bleedZwischenwert1)+parseFloat(bleedZwischenwert3)).toFixed(3);
        const bleedString1=bleed1.toString()+" bar";
        const bleedString2=bleed2.toString()+" bar";
        this.setState({bleed1: bleed1});
        this.setState({bleedString1:bleedString1});
        this.setState({bleed2: bleed2});
        this.setState({bleedString2:bleedString2});


    }



    async componentDidMount() {
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const raceID= await AsyncStorage.getItem('raceID');
        console.log(raceID);
        this.setState({raceID: raceID});
        getDropdown(accesstoken, raceID).then(racelistDropdown => {
            console.log(racelistDropdown);
            console.log(racelistDropdown[0]);
            this.setState({dataDropdown: racelistDropdown[0]});
        }).catch(function (error) {
            console.log(error);
        })
        //Funktion aufrufen für Formelwerte
        const variable1= 273.15;
        const variable2= 273.15;
        const variable3= 1.013;
        const variable4= 273.15;
        const air_pressureFL= 1.36;
        const air_pressureFR= 1.4;
        const air_pressureBL= 1.2;
        const air_pressureBR= 1.27;
        const airTemperature= 20;
        const trackTemperature= 10;

        this.setState({variable1: variable1});
        this.setState({variable2: variable2});
        this.setState({variable3: variable3});
        this.setState({variable4: variable4});
        this.setState({air_pressureFL: air_pressureFL});
        this.setState({air_pressureFR: air_pressureFR});
        this.setState({air_pressureBL: air_pressureBL});
        this.setState({air_pressureBR: air_pressureBR});
        this.setState({airTemperature: airTemperature});
        this.setState({trackTemperature: trackTemperature});

        //Funktion aufrufen für möglicherweise bereits eingegeben und berechnete Werte
        const bleed1="";
        const bleed2="";
        const bleedString1=bleed1.toString()+" bar";
        const bleedString2=bleed2.toString()+" bar";
        const air_pressureFL1= "";
        const air_pressureFR1= "";
        const air_pressureBL1= "";
        const air_pressureBR1= "";
        const airTemperatureUpdate= "";
        const heizTemperatur="";

        this.setState({bleed1: bleed1});
        this.setState({bleedString1:bleedString1});
        this.setState({bleed2: bleed2});
        this.setState({bleedString2:bleedString2});
        this.setState({air_pressureFL1: air_pressureFL1});
        this.setState({air_pressureFR1: air_pressureFR1});
        this.setState({air_pressureBL1: air_pressureBL1});
        this.setState({air_pressureBR1: air_pressureBR1});
        this.setState({airTemperatureUpdate: airTemperatureUpdate});
        this.setState({heizTemperatur:heizTemperatur});

        }

        async getSetID(event) {
        this.setState({setID: event.target.value});
        const accesstoken = await AsyncStorage.getItem('acesstoken');
        const id=event.target.value;
        console.log(id);
        getWheelSetInformation(accesstoken, id).then(racelistDropdown => {
            console.log(racelistDropdown);
            this.setState({wheelSetInformation: racelistDropdown});
        }).catch(function (error) {
            console.log(error);
        })
    }


    render() {
         let optionTemplate = this.state.dataDropdown.map(v => (
            <option value={v.id} key={v.id}>{v.name}</option>
        ));

     return(
         <View style={{overflowY: 'scroll', flex: 1, backgroundColor: '#2e3742'}}>
             <h1>{this.state.setID}</h1>
         <nav className="navbar navbar-light" style={{backgroundColor: '#d0d7de'}}>
                    <div className="container-fluid">
                        {/*<a className="navbar-brand" href="#">  <img src={image} style={{width: '70%'}}/> </a>*/}
                        <a className="navbar-brand" href="#"></a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeRace}>Hauptmenü </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewRace}>Renndaten anlegen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeShowRace}>Renndaten anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewOrder}>Reifenbestellungen verwalten </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWheel}>Reifendetails anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeWeather}>Wetterdaten anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeMaen}>Statistiken anzeigen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewFormel}>Formel Reifendruck anlegen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNewUser}>Neues Mitglied anlegen </button>
                                </li>
                                <li className="nav-item">
                                    <button style={{backgroundColor: '#d0d7de'}} className="btn btn-sm" aria-current="page" onClick={this.changeNiklas}>Niklas </button>
                                </li>
                                <br/>
                                <li className="nav-item">
                                    <button className="btn btn-primary btn-sm" aria-current="page" onClick={this.changeLogout}>Ausloggen </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
         <div className="container" style={{marginLeft: 'auto', marginRight: 'auto'}}>
             <br/>
         <h1 className="display-4" style={{color: '#d0d7de', textAlign: 'center'}} >Berechnung Reifendruck</h1>
             <br/>
             <label style={{fontSize: 16, fontFamily: 'arial', textAlign: 'center'}}> Reifenset auswählen: <select value={this.state.setID} onChange={this.getSetID}>
                        {optionTemplate}
                    </select>
             </label>
             <br/>
             <br/>
             {this.state.air_pressureBR1 == 0 &&
             <div className="input-group" style={{width: 500, marginLeft: 'auto', marginRight: 'auto'}}>
                 <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>Felgentemperatur: </label>
                 <input type="text" className="form-control" aria-label="Server"
                        style={{backgroundcolor: '#d0d7de', color: '#29323c'}}
                        onChange={(e) => this.setState({airTemperatureUpdate: e.target.value})}
                        value={this.state.airTemperatureUpdate}></input>
                 <button disabled={!this.validateForm()} type="button" className="btn btn-primary"
                         onClick={this.handleSubmit}>KALTDRUCK BERECHNEN
                 </button>
             </div>
             }
             <div>
             <br/>
             <br/>
             <h3 className="display-6" style={{color: '#d0d7de', textAlign: 'center'}}>Berechnete Kaltdruckwerte</h3>
             <table className="table table-striped table-hover table-bordered"
                           style={{width: 500, backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto', tableLayout: 'fixed'
                           }}>
                 <thead>
                 </thead>
                 <tbody>
                 <tr>
                     <th style={{width: 150}}> Linker Vorderreifen</th>
                     <td style={{width: 100}}>{this.state. air_pressureFL1}</td>
                 </tr>
                 <tr>
                     <th> Rechter Vorderreifen</th>
                     <td>{this.state. air_pressureFR1}</td>
                 </tr>
                <tr>
                     <th>Linker Hinterreifen</th>
                     <td>{this.state. air_pressureBL1}</td>
                 </tr>
                 <tr>
                     <th>Rechter Hinterreifen</th>
                     <td>{this.state. air_pressureBR1}</td>
                 </tr>
                 </tbody>
             </table>
             </div>
             <br/>
             <br/>
              {this.state.bleed2 == 0 &&
              <div>
             <div className="input-group" style={{width: 500, marginLeft: 'auto', marginRight: 'auto'}}>
                 <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>Streckentemperatur: </label>
                 <input type="text" className="form-control"  aria-label="Server"  onChange={(e)=>this.setState({trackTemperatureUpdate:e.target.value})} value={this.state.trackTemperatureUpdate}></input>
                 <button disabled={!this.validateForm1()} type="button" className="btn btn-primary" onClick={this.handleSubmit1}>BLEED BERECHNEN </button>
             </div>
             <br/>
              <div className="input-group" style={{width: 500, marginLeft: 'auto', marginRight: 'auto'}}>
                 <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>Anpassungskonstante: </label>
                 <input type="text" className="form-control"  aria-label="Server"  onChange={(e)=>this.setState({anpassungsKonstante:e.target.value})} value={this.state.anpassungsKonstante}></input>
             </div>
             <br/>
             <div className="input-group" style={{width: 500, marginLeft: 'auto', marginRight: 'auto'}}>
                 <label className="input-group-text" style={{backgroundColor: '#d0d7de'}}>Heiztemperatur: </label>
                 <input type="text" className="form-control"  aria-label="Server"  onChange={(e)=>this.setState({heizTemperatur:e.target.value})} value={this.state.heizTemperatur}></input>
             </div>
              </div>
              }
              <div>
             <br/>
             <br/>
             <h3 className="display-6" style={{color: '#d0d7de', textAlign: 'center'}}>Bleed</h3>
             </div>
             <div>
             <table className="table table-striped table-hover table-bordered"
                           style={{width: 700, backgroundColor: '#d0d7de', marginLeft: 'auto', marginRight: 'auto', tableLayout: 'fixed'}}>
                 <thead>
                 </thead>
                 <tbody>
                 <tr>
                     <th scope="row" style={{width: 500}}>Bleed Initialwert</th>
                     <td>{this.state.bleedString1}</td>
                 </tr>
                  <tr>
                     <th scope="row">Bleedwert mit Berücksichtigung der Heiztemperatur</th>
                     <td>{this.state.bleedString2}</td>
                 </tr>
                 </tbody>
             </table>
             </div>
             <br/>
             <br/>
             <div className="alert alert-secondary" role="alert" style={{backgroundColor: '#d0d7de', width: 700, marginLeft: 'auto', marginRight: 'auto'}}>
                 <h3 className='display-6' style={{textAlign: 'center'}}> Verwendete Angaben des Ingenieurs </h3>
                 <hr></hr>
                 <p style={{textAlign: 'center'}}>Pa = angegebener Kaltdruck, Tg = gemessene Temperatur, Ta = angegebene Temperatur</p>
                 <p style={{textAlign: 'center'}}>Formel: Pa*(Tg+{this.state.variable1})/(Ta+{this.state.variable2})+{this.state.variable3}*(Tg-Ta)/(Ta+{this.state.variable4})</p>
                 <hr></hr>
                 <p>Lufttemperatur: {this.state.airTemperature}</p>
                  <p>Streckentemperatur: {this.state.trackTemperature}</p>
                   <p>Luftdruck linker Vorderreifen: {this.state.air_pressureFL} </p>
                   <p>Luftdruck rechter Vorderreifen: {this.state.air_pressureFR}</p>
                   <p>Luftdruck linker Hinterreifen: {this.state.air_pressureBL}</p>
                    <p>Lufttdruck rechter Hinterreifen: {this.state.air_pressureBR}</p>
             </div>
             </div>
              <br/>
                <button type='button' className='btn btn-primary'
                        onClick={this.changeRace} style={{width: 100, marginLeft: 'auto', marginRight: 'auto'}}> ZURÜCK
                </button>
                <br/>
                <br/>
          </View>


        );
    }
}