import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    SectionList,
    AsyncStorage,
    TouchableOpacity
} from 'react-native';
import {styles} from "./styles"
import {timeoutPromise, syncData} from "./tools"
import Icon from 'react-native-vector-icons/FontAwesome';
import Select from 'react-select';
import {Button} from "react-native-web";



export default class RaceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            taskname: '',
            tasklocation: '',
            taskdescription: '',
            taskgroups: '',
            grouplist: [],
            tasksupervisor: '',
            selectedOption: null,
        }
    }

}