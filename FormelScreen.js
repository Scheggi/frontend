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
        this.props.navigation.replace('Race');
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
        const accesstoken = await AsyncStorage.getItem('acesstoken');
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
      const accesstoken = await AsyncStorage.getItem('acesstoken');
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
            <tr key={n}>
               <td>{n}</td>
               <td>{formel}</td>
            </tr>
         )
      })
   }
    /*
   render() {
      return (
         <div>
            <h1 id='title'>React Dynamic Table</h1>
            <table id='list_formel'>
               <tbody>
                  {this.renderTableData()}
               </tbody>
            </table>
         </div>
      )
   }
   */


    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={styles.textStyles}>
                    24 Stunden Rennen
                </Text>
                 <Text style={{height:60}}>
                    Neue Formel anlegen
                </Text>
                <View >
                    <TextInput
                        style={{height:50 }}
                        placeholder=" hier eingeben"
                        onChangeText={(text) => this.setState({formel:text})}
                    />
                    <Button
                        disabled={!this.validateForm()}
                        title="neue Formel anlegen"
                        onPress={this.handleSubmit}
                    />
                </View>
                <div>
                <h1 id='title'>React Dynamic Table</h1>
                <table id='list_formel'>
                   <tbody>
                      {this.renderTableData()}
                   </tbody>
                </table>
                </div>


                <Button
                        title="zurück"
                        onPress={this.changeRace}
                />

            </View>
        );
    }
}
