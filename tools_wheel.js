import AsyncStorage from '@react-native-async-storage/async-storage';
import {createKeyboardAwareNavigator} from "react-navigation";

function generateAllSets(raceID,set,cat,subcat,numberOfSets){
        for(let i =1; i < parseInt(numberOfSets)+1;i++){
            console.log(i);
            generateNewWheelSet(raceID,i,cat,subcat);
        }
    }



async function generateNewWheelSet(raceID,setNr,cat,subcat){
    let cols = [];
    for (let i =0; i < 4; i++) {
        await sendWheelRequest(0,'', '').then(Data => {
            console.log(Data);
            cols.push(Data);
        }).catch(function (error) {
            console.log(error);
        })
        //const idwheel = await AsyncStorage.getItem('WheelID')

    }
    console.log(cols)
  await sendWheelsRequest(parseInt( cols[0]), parseInt(cols[1]), parseInt(cols[2]), parseInt(cols[3]), '').then(Data => {
            console.log(Data);
            cols.push(Data);
        }).catch(function (error) {
            console.log(error);
        });
    console.debug(cols[4])
    // sendNewSetRequest(raceID,setNr,cat,subcat,wheels)
    sendNewSetRequest(raceID,setNr,cat, subcat,cols[4] );
}





async function sendWheelRequest(accestoken,air_press = 0,id_scan='',id = '' ) {
   return await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheel', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                aceess_tolen:accestoken,
                air_press:air_press,
                id_scan:id_scan,
                id:id,
            })
        })
        ).then(response => response.json()).then(data => {
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    sendWheelRequest(accestoken,air_press,id_scan,id  );
                                    }
                                ).catch( function (error) {
                                        console.log("Refresh failed");
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log("Return Data");
                  console.log(data[0].id);
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}



//generate one wheelS and return id
async function sendWheelsRequest(accestoken,id_FL,id_FR,id_BL,id_BR,id = '') {
    console.log([id_FL,id_FR,id_BL,id_BR]);
   return await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheels', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                acces_token:accestoken,
                id_FL:id_FL,
                id_FR:id_FR,
                id_BL:id_BL,
                id_BR:id_BR,
                id:id,
            })
        })
        ).then(response => response.json()).then(data => {
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    sendWheelsRequest(accestoken,id_FL,id_FR,id_BL,id_BR,id );
                                    }
                                ).catch( function (error) {
                                        console.log("Refresh failed");
                                        console.log(error);
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  console.log("Return Data");
                  console.log(data[0].id);
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


//generate one wheelsSet and return id
async function sendWheelSetRequest(id_FL,id_FR,id_BL,id_BR,id = '') {
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheels', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_FL:id_FL,
                id_FR:id_FR,
                id_BL:id_BL,
                id_BR:id_BR,
                id:id,
            })
        })
        ).then(response => response.json()).then(response => response.json()).then(
            data => {
                if (data[1]==200){
              console.log(data);
              return data[0].id;
              }
      }).catch(function (error) {
            console.log(error);
            return 0;
        })
}




//create new Set request
async function sendNewSetRequest(raceID,setNr,cat,subcat,wheels) {
    console.log([raceID,setNr,cat,subcat,wheels])
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createSet', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: '',
                setNr:setNr,
                cat:cat,
                subcat:subcat,
                raceID:raceID,
                wheels : wheels,
            })
        })
        ).then(response => response.json()).then(
            data =>{
                if(data[1]==200){
                console.log(data)};
                return data[0].id
            }).catch(function (error) {
            console.log(error);
        })
}


//  ----------------------------------------------------------------------------------------------

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('promise timeout'))
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}



async function refreshToken() {
  let accesstoken = await AsyncStorage.getItem('acesstoken');
  let refreshtoken = await AsyncStorage.getItem('refreshtoken');
  await timeoutPromise(2000, fetch(
      'https://api.race24.cloud/user/auth/refresh', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: accesstoken,
          refresh_token: refreshtoken,
        })
      }
  )).then(
      response => response.json()
  ).then(
      data => {
        AsyncStorage.setItem('acesstoken', String(data.access_token));
      }
  )
}



export {generateAllSets,sendWheelRequest,sendNewSetRequest,sendWheelsRequest}

