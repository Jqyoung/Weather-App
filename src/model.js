class WeatherForecast {
  constructor() {
    this.location = null;
    this.weatherAPI = null;
    this.animationAPI = null;
    this.weatherNow = null;
    this.weatherToday = null;
    this.weatherFuture = null;
  }

  getWeatherData(location = 'austin') {
    this.weatherAPI = `http://api.weatherapi.com/v1/forecast.json?key=92c4eba21b164ff5bc3193139232511&q=${location}&days=3&aqi=no&alerts=no`;
    return fetch(this.weatherAPI, { mode: 'cors' })
      .then((response) => response.json())
      .then((data) => {
        this.location = data.location;
        return this.sortWeatherData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sortWeatherData(data) {
    return {
      location: this.location,
      weatherNow: this.currentWeather(data),
      weatherToday: this.restOfDay(data),
      weatherFuture: this.nextThreeDays(data),
    };
  }

  currentWeather(data) {
    this.weatherNow = {
      tempC: data.current.temp_c,
      tempF: data.current.temp_f,
      conditionText: data.current.condition.text,
      conditionIcon: data.current.condition.icon,
      conditionCode: data.current.condition.code,
      time: data.location.localtime,
      isDay: data.current.is_day,
      timeZone: data.location.tz_id,
    };
    return this.weatherNow;
  }

  restOfDay(data) {
    const combinedHours = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
    const localTime = this.location.localtime.split(' ')[1];
    const hour = +localTime.split(':')[0];
    const todayForecast = combinedHours.slice(hour, hour + 24);
    this.weatherToday = todayForecast;
    console.log(data);
    console.log(this.weatherToday);
    return this.weatherToday;
  }

  nextThreeDays(data) {
    this.weatherFuture = data.forecast.forecastday;
    this.weatherFuture.timeZone = data.location.tz_id;
    return this.weatherFuture;
  }

  async getWeatherAnimation(weatherData) {
    const weatherCode = this.convertWeatherCode();
    const baseURL = 'https://api.giphy.com/v1/gifs';
    const apiKey = 'api_key=0kZ4XBDc3L5FyNJcue4uGbtbFLdQKIkl';
    const gifID = {
      sunny: '27bTd0Bz1ArO6Nu4fE',
      clear: 'heOKY8nrJUMfK',
      cloudy: '5k3G1jcuMia1wABeEK',
      fog: 'xUNd9QMlTDCkdAN5fO',
      rain: 'xTcnT45z6H5gxFYZZS',
      snow: 'l0iXz7gGDJoQIBRVWD',
      sleet: '12N67TnsGuckZG',
      ice: 'hjvqSizgd6pWM',
    };

    if (weatherCode === 'sunny') {
      if (weatherData.isDay === 1) {
        this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID.sunny);
      } else if (weatherData.isDay === 0) {
        this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID.clear);
      }
    } else if (weatherCode === 'cloudy') {
      this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID[weatherCode]);
    } else if (weatherCode === 'fog') {
      this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID[weatherCode]);
    } else if (weatherCode === 'rain') {
      this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID[weatherCode]);
    } else if (weatherCode === 'snow') {
      this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID[weatherCode]);
    } else if (weatherCode === 'sleet') {
      this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID[weatherCode]);
    } else if (weatherCode === 'ice') {
      this.animationAPI = this.getGifAPI(baseURL, apiKey, gifID[weatherCode]);
    }

    const response = await fetch(this.animationAPI, { mode: 'cors' });
    const gifData = await response.json();
    return gifData;
  }

  convertWeatherCode() {
    const code = this.weatherNow.conditionCode;
    const targetCode = {
      cloudy: [1003, 1006, 1009],
      fog: [1030, 1135, 1147],
      rain: [1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1201, 1243, 1246],
      snow: [1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282],
      sleet: [1069, 1204, 1207, 1249, 1252],
      ice: [1237, 1261, 1264, 1117],
    };
    let convertedCode;
    if (code === 1000) {
      convertedCode = 'sunny';
    } else if (targetCode.cloudy.includes(code)) {
      convertedCode = 'cloudy';
    } else if (targetCode.fog.includes(code)) {
      convertedCode = 'fog';
    } else if (targetCode.rain.includes(code)) {
      convertedCode = 'rain';
    } else if (targetCode.snow.includes(code)) {
      convertedCode = 'snow';
    } else if (targetCode.sleet.includes(code)) {
      convertedCode = 'sleet';
    } else if (targetCode.ice.includes(code)) {
      convertedCode = 'ice';
    }
    return convertedCode;
  }

  getGifAPI(baseURL, APIKey, gifID) {
    this.animationAPI = `${baseURL}/${gifID}?${APIKey}`;
    return this.animationAPI;
  }
}

export { WeatherForecast };
