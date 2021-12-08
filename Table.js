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
              	borderWidth: 1,

              }}>

                <thead >
                  <tr>
                    {colNames.map((headerItem, index) => (
                      <th style={{borderStyle: 'solid',  borderWidth: 1}} key={index}>{headerItem}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Object.values(list).map((obj, index) => (
                    <tr key={index}>
                      {Object.values(obj).map((value, index2) => (
                        <td style={{borderStyle: 'solid',  borderWidth: 1}} key={index2}>{value}</td>
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
