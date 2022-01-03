import React, { useState } from "react"

function Table({list, width=920, height='auto'}) {

      const colNames = ['Zeitstempel', 'Lufttemperatur', 'Streckentemperatur', 'Streckenverhältnis']


      return (
        <div>
          {list.length > 0 && (
            <table
              cellSpacing='0'
              style={{
              	width: width,
              	height: height,
              	margin: 15,

              }}>

                <thead >
                  <tr bgcolor='#696969' style={{height: 40, textAlign: "center", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}>
                    {colNames.map((headerItem, index) => (
                      <th style={{borderStyle: 'solid',  borderWidth: 'thin'}} key={index}>{headerItem}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Object.values(list).map((obj, index) => (
                    <tr key={index}>
                      {Object.values(obj).map((value, index2) => (
                        <td style={{backgroundColor: 'lightgrey', borderStyle: 'solid', borderWidth: 'thin', borderColor: 'white', height: 20, padding: '8px', fontFamily: 'arial'}} key={index2}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
            </table>
          )}
        </div>
        )
    }

    export default Table
