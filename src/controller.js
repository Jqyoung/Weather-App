class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;

    this.view.listenSubmitEvent(this.handleWeatherData);
    this.view.listenToggleEvent();
  }

  handleWeatherData = async (location) => {
    try {
      this.view.displayLoadingScreen();
      const weatherData = await this.model.getWeatherData(location);
      const weatherGif = await this.model.getWeatherAnimation(weatherData.weatherNow);
      this.view.undisplayLoadingScreen();
      this.view.removeError();
      this.view.displayWeatherNow(weatherData, weatherGif);
      this.view.displayTodayForecast(weatherData.weatherToday);
      this.view.displayFutureForecast(weatherData.weatherFuture);
    } catch (error) {
      this.view.undisplayLoadingScreen();
      this.view.displayError();
      console.log(error);
    }
  };
}

export { Controller };
