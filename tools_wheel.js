import AsyncStorage from '@react-native-async-storage/async-storage';
import {createKeyboardAwareNavigator} from "react-navigation";

//raceID, set, cat, subcat, identifier, numberOfSets
function generateAllSets(raceID,set,cat,subcat,numberOfSets){
    for(let i =1; i < parseInt(numberOfSets)+1;i++){
        generateNewWheelSet(raceID,i,cat,subcat)
    }
}


async function generateNewWheelSet(raceID,setNr,cat,subcat){
    let cols = [];
    for (let i =0; i < 4; i++) {
        const idwheel = await sendWheelRequest(0,'', '');
        //const idwheel = await AsyncStorage.getItem('WheelID')
        console.log(idwheel);
        cols.push(idwheel);
    }
   const wheelsid = await sendWheelsRequest(cols[0], cols[1], cols[2], cols[3], '');
    // sendNewSetRequest(raceID,setNr,cat,subcat,wheels)
    sendNewSetRequest(raceID,setNr,cat, subcat,wheelsid );
}

/*
//generate one wheel and return id
//generate one wheel and return id
async function sendWheelRequest(air_press = 0,id_scan='',id = '',save=0) {
    await timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheel', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                air_press:air_press,
                id_scan:id_scan,
                id:id,
            })
        })
        );
    console.log(response)
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }else{
    if(type === 'blob') {
      content = await response.blob();
    } else if(type === 'text') {
      content = await response.text();
    }
    }
    return content;
}



 */



async function sendWheelRequest(air_press = 0,id_scan='',id = '') {
   return timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheel', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                air_press:air_press,
                id_scan:id_scan,
                id:id,
            })
        })
        ).then(response => response.json()).then(
            data => {
                if (data[1]==200){
              console.log(data);
              //AsyncStorage.setItem('WheelID',data[0].id);
              return data[0].id;
              }else{
                    return [];
                }
                return []
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}



//generate one wheelS and return id
async function sendWheelsRequest(id_FL,id_FR,id_BL,id_BR,id = '') {
    console.log([id_FL,id_FR,id_BL,id_BR]);
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

