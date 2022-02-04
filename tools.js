import AsyncStorage from '@react-native-async-storage/async-storage';

// create new race and return raceID
//wheel_cont/changeSet
async function changeWheelSet(id,variant,order_duration,description){
    timeoutPromise(2000, fetch(
            'https://api.race24.cloud/wheel_cont/changeSet', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id:id,
                    variant:variant,
                    order_duration:order_duration,
                    description:description,
                })
            })
            ).then(response => response.json()).then(
                data => {
                if (data[1]==200) {
                    console.log(data[0])
                }
                else {
                    console.log("failed")
                }
            }
            ).catch(function (error) {
            console.log(error);
        })
}



async function createNewRaceRequest(accesstoken,type,place,date) {
    console.log([accesstoken,type,place,date]);
    return await timeoutPromise(2000, fetch(
            'https://api.race24.cloud/race/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token:accesstoken,
                    type:type,
                    place:place,
                    date:date,
                })
            })
            ).then(response => response.json()).then(data => {
                console.log(data)
                if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                    createNewRaceRequest(token,type,place,date);
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
                  return data[0].id;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
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
function getRaceList(token) {
  return timeoutPromise(2000, fetch("https://api.race24.cloud/user/race/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: token
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"]=== "Token has expired" || data["msg"]==="Not enough segments" ){
                                refreshToken().then( token => {
                                    console.log(token)
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
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

// get RaceDetails od RaceID
function getRaceDetails_by_ID(accesstoken,raceid) {
  return timeoutPromise(2000, fetch("https://api.race24.cloud/user/raceDetails/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID:raceid,
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getRaceDetails_by_ID(token,raceid);
                                    }
                                ).catch( function (error) {
                                        console.log("Refresh failed");
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}



///user/weather/getlast10
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
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}


//get Wheels
function getWheelsList(accesstoken,raceID) {
  return timeoutPromise(2000, fetch("https://api.race24.cloud/wheels_start/get", {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          access_token: accesstoken,
          raceID: raceID
      })
      })).then(response => response.json()).then(data => {
              console.log(data);
              if ("msg" in data){
                            if (data["msg"] === "Token has expired"){
                                refreshToken().then( token => {
                                        getWheelsList(token,raceID);
                                    }
                                ).catch( function (error) {
                                        console.log("Refresh failed");
                                    }
                                );
                                return [];
                            }
                        }
              else{
                  return data[0].data;
              }
              return [];
      }).catch(function (error) {
            console.log(error);
            return [];
        })
}

async function refreshToken() {
  let accesstoken = await AsyncStorage.getItem('accesstoken');
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
        AsyncStorage.setItem('accesstoken', String(data.access_token));
      }
  )
}

export {createNewRaceRequest,getWeatherTab,timeoutPromise, refreshToken,getRaceList,getWheelsList,getRaceDetails_by_ID,changeWheelSet}