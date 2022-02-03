import React, { useState } from "react"

function RenderApiData({list, width=300, height=350}) {

      const colNames = ['Daten von Wetter.com']

      if(list == undefined) {
        return ""
      }


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
                  <tr bgcolor='#808080' style={{height: 45, width: 150, textAlign: "center", padding: '8px', fontWeight: 'bold', color: 'white', fontFamily: 'arial'}}>
                    {colNames.map((headerItem, index) => (
                      <th style={{borderStyle: 'solid',  borderWidth: 'thin'}} key={index}>{headerItem}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {Object.values(list).map((obj, index) => (
                    <tr key={index}>
                      <td>{obj}</td>
                    </tr>
                  ))}
                </tbody>
            </table>
          )}
        </div>
        )
    }

    export default RenderApiData
