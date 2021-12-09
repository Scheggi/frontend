import React, { useState } from "react"
import {TextInput, View, Button} from 'react-native';

function Table({id, data}) {

  //let dataItem = data[0];

  var state = {
    setnumber:   0,//      dataItem.setnumber,
    status: "free", //          dataItem.status,
    cat:    "Slicks",//           dataItem.cat,
    subcat:  "Medium"       ,//   dataItem.subcat,
    air_pressureFL: 0,//   dataItem.air_pressureFL,
    air_pressureFR: 0,//   dataItem.air_pressureFR,
    air_pressureBL: 0,//   dataItem.air_pressureBL,
    air_pressureBR: 0,//   dataItem.air_pressureBR,

    wheel_idFL:  0,//      dataItem.wheel_idFL,
    wheel_idFR:  0,//      dataItem.wheel_idFR,
    wheel_idBL:  0,//      dataItem.wheel_idBL,
    wheel_idBR:  0,//      dataItem.wheel_idBR,

    wheel_editFL: 'iwas',//     dataItem.wheel_editFL,
    wheel_editFR: 'iwas',//     dataItem.wheel_editFR,
    wheel_editBL: 'iwas',//     dataItem.wheel_editBL,
    wheel_editBR:  'iwas',//    dataItem.wheel_editBR,
  }

      return (

        <View>

          <table style={{margin: 5, borderWidth: 15}}>
            <thead>
              <tr>
                <th style={{borderStyle: 'solid', borderWidth: 1}}>setnumber</th>
                <th style={{borderStyle: 'solid', borderWidth: 1}}>status</th>
                <th style={{borderStyle: 'solid', borderWidth: 1}}>cat</th>
                <th style={{borderStyle: 'solid', borderWidth: 1}}>subcat</th>
                <th style={{borderStyle: 'solid', borderWidth: 1}}>air_pressure</th>
                <th style={{borderStyle: 'solid', borderWidth: 1}}>wheel_id</th>
                <th style={{borderStyle: 'solid', borderWidth: 1}}>wheel_edit</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.setnumber} onChangeText={(text) => state['setnumber'] = text} style={{backgroundColor: 'white', width: 60, borderStyle: 'solid', borderWidth: 1, placeholderTextColor: 'black'}}/></td>
                <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.status} onChangeText={(text) => state['status'] = text} style={{backgroundColor: 'white', width: 60, borderStyle: 'solid', borderWidth: 1, placeholderTextColor: 'black'}}/></td>
                <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.cat} onChangeText={(text) => state['cat'] = text} style={{backgroundColor: 'white', width: 60, borderStyle: 'solid', borderWidth: 1, placeholderTextColor: 'black'}}/></td>
                <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.subcat} onChangeText={(text) => state['subcat'] = text} style={{backgroundColor: 'white', width: 60, borderStyle: 'solid', borderWidth: 1, placeholderTextColor: 'black'}}/></td>

                <td style={{borderStyle: 'solid', borderWidth: 1}}>

                  <table>

                    <thead>
                      <tr>
                        <th style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.air_pressureFL} onChangeText={(text) => state['air_pressureFL'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></th>
                        <th style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.air_pressureFR} onChangeText={(text) => state['air_pressureFR'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></th>
                      </tr>
                    </thead>


                    <tbody>
                      <tr>
                        <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.air_pressureBL} onChangeText={(text) => state['air_pressureBL'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></td>
                        <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.air_pressureBR} onChangeText={(text) => state['air_pressureBR'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></td>

                      </tr>
                    </tbody>
                  </table>

                </td>

                <td style={{borderStyle: 'solid', borderWidth: 1}}>

                  <table>

                    <thead>
                      <tr>
                        <th style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_idFL} onChangeText={(text) => state['wheel_idFL'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></th>
                        <th style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_idFR} onChangeText={(text) => state['wheel_idFR'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></th>
                      </tr>
                    </thead>


                    <tbody>
                      <tr>
                        <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_idBL} onChangeText={(text) => state['wheel_idBL'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></td>
                        <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_idBR} onChangeText={(text) => state['wheel_idBR'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></td>

                      </tr>
                    </tbody>
                  </table>

                </td>

                <td style={{borderStyle: 'solid', borderWidth: 1}}>


                  <table>

                    <thead>
                      <tr>
                        <th style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_editFL} onChangeText={(text) => state['wheel_editFL'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></th>
                        <th style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_editFR} onChangeText={(text) => state['wheel_editFR'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></th>
                      </tr>
                    </thead>


                    <tbody>
                      <tr>
                        <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_editBL} onChangeText={(text) => state['wheel_editBL'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></td>
                        <td style={{borderStyle: 'solid', borderWidth: 1}}><TextInput id={id} placeholder={state.wheel_editBR} onChangeText={(text) => state['wheel_editBR'] = text} style={{backgroundColor: 'white', width: 60, placeholderTextColor: 'black'}}/></td>

                      </tr>
                    </tbody>
                  </table>

                </td>

              </tr>
            </tbody>

          </table>
        </View>
        )
    }

    export default Table