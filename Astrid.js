import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData, getRaceList,getFormelList} from "./tools";

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
            bleed1: 0,
            bleedString1:"",
            //bleed der Streckentemperatur und Heiztemperatur berücksichtigt
            bleed2: 0,
            bleedString2: "",
            anpassungsKonstante: "",
            heizTemperatur: "",
        }
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
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



    render() {

     return(
         <View style={{ overflowY: 'scroll', flex:1}}>
         <div className="container" >
             <br></br>
         <h1>Kaltdruck Berechnung</h1>
             <br></br>
             {this.state.air_pressureBR1 == 0 &&
             <div className="input-group" style={{width: '70%'}}>
                 <span className="input-group-text">Felgentemperatur: </span>
                 <input type="text" className="form-control" aria-label="Server"
                        onChange={(e) => this.setState({airTemperatureUpdate: e.target.value})}
                        value={this.state.airTemperatureUpdate}></input>
                 <button disabled={!this.validateForm()} type="button" className="btn btn-primary"
                         onClick={this.handleSubmit}>Kaltdruck berechnen
                 </button>
             </div>
             }
              <br></br>
             {this.state.airTemperatureUpdate=="" ? <h3>An die gemessene Felgentemperatur angepasste Kaltdruckwerte:</h3> : <h3>An die gemessene Felgentemperatur von {this.state.airTemperatureUpdate} Grad angepasste Kaltdruckwerte:</h3> }

             <table className="table table-striped table-hover">
                 <thead>
                 </thead>
                 <tbody>
                 <tr>
                     <th scope="row">air_pressureFL</th>
                     <td>{this.state. air_pressureFL1}</td>
                 </tr>
                 <tr>
                     <th scope="row">air_pressureFR</th>
                     <td>{this.state. air_pressureFR1}</td>
                 </tr>
                <tr>
                     <th scope="row">air_pressureBL</th>
                     <td>{this.state. air_pressureBL1}</td>
                 </tr>
                 <tr>
                     <th scope="row">air_pressureBR</th>
                     <td>{this.state. air_pressureBR1}</td>
                 </tr>
                 </tbody>
             </table>
             <br></br>
             {this.state.bleed2 == 0 &&
             <div>
                 <div className="input-group" style={{width: '70%'}}>
                     <span className="input-group-text">Streckentemperatur: </span>
                     <input type="text" className="form-control" aria-label="Server"
                            onChange={(e) => this.setState({trackTemperatureUpdate: e.target.value})}
                            value={this.state.trackTemperatureUpdate}></input>
                     <button disabled={!this.validateForm1()} type="button" className="btn btn-primary"
                             onClick={this.handleSubmit1}>Bleed berechnen
                     </button>
                 </div>
                 <div className="input-group" style={{width: '70%'}}>
                     <span className="input-group-text">Anpassungskonstante: </span>
                     <input type="text" className="form-control" aria-label="Server"
                            onChange={(e) => this.setState({anpassungsKonstante: e.target.value})}
                            value={this.state.anpassungsKonstante}></input>
                 </div>
                 <div className="input-group" style={{width: '70%'}}>
                     <span className="input-group-text">Heiztemperatur: </span>
                     <input type="text" className="form-control" aria-label="Server"
                            onChange={(e) => this.setState({heizTemperatur: e.target.value})}
                            value={this.state.heizTemperatur}></input>
                 </div>
             </div>
             }
              <br></br>
             <h3>Bleed:</h3>
             <table className="table">
                 <thead>
                 </thead>
                 <tbody>
                 <tr>
                     <th scope="row">Bleed Initialwert:</th>
                     <td>{this.state.bleedString1}</td>
                 </tr>
                  <tr>
                     <th scope="row">Bleedwert mit Berücksichtigung der Heiztemperatur:</th>
                     <td>{this.state.bleedString2}</td>
                 </tr>
                 </tbody>
             </table>
             <br></br>
             <div class="alert alert-secondary" role="alert">
                 <h4> Verwendete Angaben des Ingenierurs: </h4>
                 <hr></hr>
                 <p>Pa = angegebener Kaltdruck, Tg = gemessene Temperatur, Ta = angegebene Temperatur</p>
                 <p>Formel: Pa*(Tg+{this.state.variable1})/(Ta+{this.state.variable2})+{this.state.variable3}*(Tg-Ta)/(Ta+{this.state.variable4})</p>
                 <hr></hr>
                 <p>Air Temperature : {this.state.airTemperature}</p>
                  <p>Track Temperature: {this.state.trackTemperature}</p>
                   <p>air_pressureFL: {this.state.air_pressureFL} </p>
                   <p>air_pressureFR: {this.state.air_pressureFR}</p>
                   <p>air_pressureBL: {this.state.air_pressureBL}</p>
                    <p>air_pressureBR: {this.state.air_pressureBR}</p>
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


