import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
//import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList} from "./tools";

export default class WheelsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list_wheel:[],
            set_wheel:{},
        }
    }

    renderTableData() {
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
                    Rennen auswählen
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
                        disabled={!this.validateForm()}
                        title="zurück"
                        onPress={this.props.navigation.replace("Splash")}
                />

            </View>
        );
    }
}
