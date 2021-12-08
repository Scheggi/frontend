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


// möchte data[0].id wieder haben
// das habe ich vor:
async function generateNewWheelSet(raceID,setNr,cat,subcat) {
    let cols = [];
    for (let i = 0; i < 4; i++) {
        const idwheel = await sendWheelRequest(0, '', '');
        //const idwheel = await AsyncStorage.getItem('WheelID')
        console.log(idwheel);
        cols.push(idwheel);
    }
}


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