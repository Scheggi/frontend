import React from "react";
import {Text, ToastAndroid, View} from "react-native";
import {styles} from "./styles"
import AsyncStorage from '@react-native-async-storage/async-storage';
import {timeoutPromise, refreshToken,getRaceList} from "./tools";


export class NavScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    async checkGroup(){
        const group = await AsyncStorage.getItem("usergroup");
        if (group==="Helper"){
            this.props.navigation.replace("Helper")
        }
        if (group==="Ingenieur"){
            this.props.navigation.replace("Ingenieur")
        }
        if (group==="Manager"){
            this.props.navigation.replace("Manager")
        }
    }

    async componentDidMount() {
        try {
              this.focusListener = this.props.navigation.addListener('didFocus', () => {
                    this.checkGroup()
            })

        } catch (e) {
                ToastAndroid.show(e, ToastAndroid.SHORT);
        }

    }
    componentWillUnmount () {
        this.focusListener.remove()
    }

    render() {
        return (
            <View style={{overflowY: 'scroll', flex: 1, backgroundColor: '#2e3742'}}>
            <h1 className="display-6" style={{color: '#d0d7de', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto'}}> Reifenmanagement </h1>
            </View>
        );
    }
}