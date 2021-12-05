import React from "react";
import {Button, Text, TextInput, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList} from "./tools";

export default class NewOrderScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            raceid: '',
            tyretype: '',
            tyremix: '',
            term: '',
            variant: '',
            number: '',
            orderdate: '',
            ordertime: '',
            pickuptime: ''
        }
    }

    validateForm() {
        return this.state.raceid.length > 0 ;
    }

    handleSubmit = event => {
        event.preventDefault();
        this.sendNewOrderRequest(this.state.raceid, this.state.tyretype, this.state.tyremix, this.state.term, this.state.variant, this.state.number, this.state.orderdate, this.state.ordertime, this.state.pickuptime);
    }
    async sendNewOrderRequest(raceid,tyretype,tyremix,term,variant,number,orderdate,ordertime,pickuptime) {


       timeoutPromise(2000, fetch(
            'https://api.race24.cloud/order/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    raceid:raceid,
                    tyretype:tyretype,
                    tyremix:tyremix,
                    term:term,
                    variant:variant,
                    number:number,
                    orderdate:orderdate,
                    ordertime:ordertime,
                    pickuptime:pickuptime
                })
            })
            ).then(response => response.json()).then(data => {
                if (data[1]==200) {
                    this.props.navigation.replace('Race');
                }
                else {
                    console.log("failed")
                }
            }).catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <View style={styles.viewStyles}>
                <Text style={bigStyle}>
                    24h-Rennen
                </Text>
                 <Text style={subStyle}>
                    Neue Reifenbestellung anlegen
                </Text>
                <View >
                    <Text style={orderHeaderStyle}> Renn-ID: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=""
                        onChangeText={(text) => this.setState({raceid:text})}
                    />
                    <Text style={emptylineStyle}> </Text>
                    <Text style={orderHeaderStyle}> Reifenart: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=""
                        onChangeText={(text) => this.setState({tyretype:text})}
                    />
                    <Text style={emptylineStyle}> </Text>
                    <Text style={orderHeaderStyle}> Mischung: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=""
                        onChangeText={(text) => this.setState({tyremix:text})}
                    />
                    <Text style={emptylineStyle}> </Text>
                    <Text style={orderHeaderStyle}> Bezeichnung: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=""
                        onChangeText={(text) => this.setState({term:text})}
                    />
                    <Text style={emptylineStyle}> </Text>
                     <Text style={orderHeaderStyle}> Bearbeitungsvariante: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=""
                        onChangeText={(text) => this.setState({variant:text})}
                    />
                    <Text style={emptylineStyle}> </Text>
                    <Text style={orderHeaderStyle}> Anzahl Reifensätze: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=" 1"
                        onChangeText={(text) => this.setState({number:text})}
                    />
                    <Text style={emptylineStyle}> </Text>
                    <Text style={orderHeaderStyle}> Bestelldatum: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=" TT.MM.JJJJ"
                        onChangeText={(date) => this.setState({orderdate:date})}
                    />
                    <Text style={emptylineStyle}> </Text>
                    <Text style={orderHeaderStyle}> Bestellzeit: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=" SS:MM"
                        onChangeText={(time) => this.setState({ordertime:time})}
                    />
                    <Text style={emptylineStyle}> </Text>
                    <Text style={orderHeaderStyle}> Abholzeit: </Text>
                    <TextInput
                        style={orderTextStyle}
                        placeholder=" SS:MM"
                        onChangeText={(time) => this.setState({pickuptime:time})}
                    />
                    <Button
                        disabled={!this.validateForm()}
                        title="Reifenbestellung aufgeben"
                        onPress={this.handleSubmit}
                    />
                </View>

            </View>
        );
    }
}

const bigStyle = {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold'
}

const subStyle = {
    fontSize: 20,
    height: 60
}

const emptylineStyle = {
    height: 20,
    backgroundColor: '#ffffff',
}

const orderHeaderStyle = {
    height: 40,
    width: 300,
    margin: 3,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#696969',
    color: '#ffffff',
    fontweight: 'bold',
    fontSize: 16
};

const orderTextStyle = {
    height: 40,
    width: 300,
    margin: 3,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#d3d3d3',
    fontSize: 14
};