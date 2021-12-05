import AsyncStorage from '@react-native-async-storage/async-storage';


async function sendNewRaceRequest(id,temp_air,temp_ground,weather_des) {
   timeoutPromise(2000, fetch(
        'https://api.race24.cloud/weather/create/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                raceID: AsyncStorage.getItem("raceID"),
                temp_air:temp_air,
                temp_ground:temp_ground,
                datetime: this.getTime(),
                weather_des:weather_des,
            })
        })
        ).then(response => response.json()).then(
            //timer von 30 min neu startem
            ).catch(function (error) {
            console.log(error);
        })
}



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

//get Race List
function getRaceList(accesstoken) {
  //const accesstoken = AsyncStorage.getItem('acesstoken');
  return timeoutPromise(2000, fetch("https://api.race24.cloud/user/race/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getRaceList(token);
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
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


//get Weather Tab
function getWeatherTab(accesstoken,raceID) {
    console.log(raceID)
  return timeoutPromise(2000, fetch("https://api.race24.cloud/user/weather/getlast10", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID : raceID,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getWeatherTab(token,raceID);
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
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}



function getFormelList(accesstoken) {
  //const accesstoken = AsyncStorage.getItem('acesstoken');
  return timeoutPromise(2000, fetch("https://api.race24.cloud/formel/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getRaceList(token);
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
                  console.log(data[0].data);
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
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

export {getWeatherTab,timeoutPromise, refreshToken,getRaceList,getFormelList}

