import AsyncStorage from '@react-native-async-storage/async-storage';


function generateNewWheelCont(set,cat,subcat,raceID,status="frei",id = ""){
    let cols = [];
    for (let i =0; i < 4; i++) {
        const id = sendWheelRequest(edit ="",air_press = 0,id_scan="",id = "")
        cols.push(id)
    }
    const wheelsid = sendWheelsRequest(cols[0],cols[1],cols[2],cols[3],temp=0,id = "")
    sendWheelContRequest(set,cat,subcat,raceID,status="frei",wheels_id,id = "")

}

async function sendWheelRequest(edit ="",air_press = 0,id_scan="",id = "") {
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/createWheel', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                edit: edit,
                air_press:air_press,
                id_scan:id_scan,
                id:id,
            })
        })
        ).then(response => response.json()).then(
            data = console.log(data);
            return data[0].id;
            ).catch(function (error) {
            console.log(error);
        })
}

async function sendWheelsRequest(id_FL,id_FR,id_BL,id_BR,temp=0,id = "") {
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
                temp:temp
                id:id,
            })
        })
        ).then(response => response.json()).then(
            data = console.log(data);
            return data[0].id;
            ).catch(function (error) {
            console.log(error);
        })
}


async function sendWheelContRequest(set,cat,subcat,raceID,status="frei",wheels_id,id = "") {
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/wheel_cont/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                set:set,
                cat:cat,
                subcat:subcat,
                raceID:raceID,
                status:status,
                id:id,
                id_wheels = wheels_id,
            })
        })
        ).then(response => response.json()).then(
            message = console.log(message[0].message);
            ).catch(function (error) {
            console.log(error);
        })
}


//  ----------------------------------------------------------------------------------------------

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("promise timeout"))
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



export {sendWheelContRequest,sendWheelsRequest,sendWheelRequest}

