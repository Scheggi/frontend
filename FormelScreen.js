import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken, syncData, getRaceList,getFormelList} from "./tools";

export default class FormelScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_formel:[],
            formel:"",
        }
    }

    changeRace = event => {
        event.preventDefault();
        this.props.navigation.goBack();
    }

    validateForm() {
        return this.state.formel.length > 0 ;
    }
    handleSubmit = event => {
        event.preventDefault();
        this.sendNewFormelRequest(this.state.formel);
    }

    async sendNewFormelRequest(formel) {
        console.log(formel)
       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/formel/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formel:formel,
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    this.getTabularData()
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    async getTabularData(){
        const accesstoken = await AsyncStorage.getItem('accesstoken');
        getFormelList(accesstoken).then(formellistTab => {
            console.log(formellistTab);
            this.setState({list_formel: formellistTab});
        }).catch(function (error) {
            console.log(error);
        })
    }

    async componentDidMount() {
        await this.getTabularData()
    }

    /*
    async componentDidMount() {
      const accesstoken = await AsyncStorage.getItem('accesstoken');
      timeoutPromise(2000, fetch("https://api.race24.cloud/formel/get", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              access_token: accesstoken,
          })
          })).then(response => response.json()).then(data => {
              console.log(data);
              this.setState({list_formel: data[0].data})
          })
    }

     */

    renderTableData() {
        console.log(this.state.list_formel)
        return this.state.list_formel.map((list_formel, index) => {
            const { n, formel } =list_formel //destructuring
            return (
            <tr bgcolor='#696969' style={{textAlign: "left", padding: '8px', color: 'white', fontFamily: 'arial'}} key={n}>
               <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 100, padding: '8px'}} >{n}</td>
               <td style={{border: "solid", borderColor: 'dimgrey', height: 20, width: 150, padding: '8px'}} >{formel}</td>
            </tr>
         )
      })
   }

    render() {
        return (
            <View style={viewStyles1}>
                <Text style={styles.textStyles}>
                    Formel Reifendruck anlegen
                </Text>
                 <Text style={{height:30}}>
                </Text>
                <View>
                    <TextInput
                        style={{fontfamily: 'arial', height: 30, width: 500, textAlign: 'center', backgroundColor: '#d3d3d3'}}
                        placeholder="Formel hier eingeben"
                        onChangeText={(text) => this.setState({formel:text})}
                    />
                    <Text style={{height: 20}}></Text>
                </View>
                <View>
                    <Button
                        disabled={!this.validateForm()}
                        title="Formel anlegen"
                        onPress={this.handleSubmit}
                    />
                    <Text style={{height: 20}}></Text>
                </View>
                <div>
                <h1 style={{fontsize: 30, fontFamily: 'arial'}} id='title'>Angelegte Formeln</h1>
                <table  id='list_formel'>
                   <tbody>
                      {this.renderTableData()}
                   </tbody>
                </table>
                </div>
                <View  style={{width: 200}}>
                 <Text style={{height: 20}}></Text>
                <Button
                        title="zurück"
                        onPress={this.changeRace}
                />
                </View>
            </View>
        );
    }
}

const viewStyles1= {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'arial',
        overflowY: 'scroll',
    };