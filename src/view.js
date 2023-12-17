import { createDomElement } from './helpers/createDomElement';

class UserInterface {
  constructor() {
    this.body = document.querySelector('body');

    this.header = createDomElement({ elementTag: 'div', className: 'header', textContent: 'Weather App' });
    this.main = createDomElement({ elementTag: 'div', className: 'main' });
    this.footer = createDomElement({ elementTag: 'div', className: 'footer' });

    // input form
    this.locationForm = createDomElement({ elementTag: 'form', className: 'location-form' });
    this.locationInput = createDomElement({ elementTag: 'input', attr: { type: 'text', placeHolder: 'Search Location...' } });
    this.locationSubmitBtn = createDomElement({ elementTag: 'button' });

    // temp toggle
    this.tempToggle = createDomElement({ elementTag: 'span', className: 'temp-toggle', attr: { 'data-toggle': 'f' } });
    this.toggleButton = createDomElement({ elementTag: 'button', className: 'toggle-button' });
    this.buttonF = createDomElement({ elementTag: 'span', className: 'display-f active-temp', textContent: '\u2109 ' });
    this.buttonC = createDomElement({ elementTag: 'span', className: 'display-c', textContent: '\u2103 ' });
    this.separator = createDomElement({ elementTag: 'span', className: 'separator', textContent: '/' });

    // footer
    this.footerText = createDomElement({ elementTag: 'span', className: 'footer-text' });
    this.footerText.innerHTML = 'Copyright &copy; 2023 Joey Young';
    this.footerLink = createDomElement({ elementTag: 'a', attr: { href: 'https://github.com/Jqyoung/Weather-App', target: '_blank' } });
    this.footerIcon = createDomElement({ elementTag: 'img', className: 'footer-icon', attr: { src: '../images/GitHub.png', alt: 'github' } });

    this.weatherContainer = createDomElement({ elementTag: 'div', className: 'weather-container' });
    this.toggleButton.append(this.buttonF, this.separator, this.buttonC);
    this.tempToggle.append(this.toggleButton);
    this.header.append(this.tempToggle);
    this.body.append(this.header, this.main, this.footer);
    this.footerLink.append(this.footerIcon);
    this.footer.append(this.footerText, this.footerLink);
    this.locationForm.append(this.locationInput, this.locationSubmitBtn);
    this.main.append(this.locationForm, this.weatherContainer);
  }

  get input() {
    return this.locationInput.value;
  }

  resetLocationInput() {
    this.locationInput.value = '';
  }

  listenSubmitEvent(eventHandler) {
    this.locationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.input === '') return;
      this.weatherContainer.innerHTML = '';
      eventHandler(this.input);
      this.resetLocationInput();
    });
  }

  listenToggleEvent() {
    this.toggleButton.addEventListener('click', this.toggleTempDisplay);
  }

  displayWeatherNow(weatherData, weatherGif) {
    this.body.style.backgroundImage = `url(${weatherGif.data.images.original.url})`;
    const weatherNowContainer = createDomElement({ elementTag: 'div', className: 'weather-now-container' });
    const locationMain = createDomElement({ elementTag: 'h2', className: 'main-location', textContent: weatherData.location.name });
    const locationSub = createDomElement({ elementTag: 'h3', className: 'sub-location', textContent: `${weatherData.location.region}, ${weatherData.location.country}` });
    const iconContainer = createDomElement({ elementTag: 'div', className: 'icon-container' });
    const conditionIcon = createDomElement({ elementTag: 'img', className: 'icon', attr: { src: weatherData.weatherNow.conditionIcon } });
    const tempContainer = createDomElement({ elementTag: 'div', className: 'temp-container' });

    const temp = createDomElement({ elementTag: 'span', className: 'temp-f', textContent: weatherData.weatherNow.tempF, attr: { 'data-status': 'show' } });
    const tempSymbol = createDomElement({ elementTag: 'span', className: 'symbol', textContent: '\u2109', attr: { 'data-status': 'show' } });

    const tempC = createDomElement({ elementTag: 'span', className: 'temp-c', textContent: weatherData.weatherNow.tempC, attr: { 'data-status': 'hidden' } });
    const tempSymbolC = createDomElement({ elementTag: 'span', className: 'symbol', textContent: '\u2103', attr: { 'data-status': 'hidden' } });

    if (this.tempToggle.dataset.toggle === 'f') {
      tempC.style.display = 'none';
      tempSymbolC.style.display = 'none';
      temp.dataset.status = 'show';
      tempSymbol.dataset.status = 'show';
      tempC.dataset.status = 'hidden';
      tempSymbolC.dataset.status = 'hidden';
    } else if (this.tempToggle.dataset.toggle === 'c') {
      temp.style.display = 'none';
      tempSymbol.style.display = 'none';
      temp.dataset.status = 'hidden';
      tempSymbol.dataset.status = 'hidden';
      tempC.dataset.status = 'show';
      tempSymbolC.dataset.status = 'show';
    }

    const dateAndTime = weatherData.weatherNow.time.split(' ');
    const fullDate = dateAndTime[0].split('-');
    const time = dateAndTime[1];
    const date = new Date(fullDate[0], fullDate[1] - 1, fullDate[2]);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: weatherData.weatherNow.timeZone });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const dayTimeText = createDomElement({ elementTag: 'p', className: 'day-time', textContent: `${dayOfWeek}, ${time}` });
    const dateText = createDomElement({ elementTag: 'p', className: 'date', textContent: ` ${month} ${day}, ${year}` });
    const divider = createDomElement({ elementTag: 'div', className: 'divider' });

    const conditionText = createDomElement({ elementTag: 'p', className: 'condition-text', textContent: weatherData.weatherNow.conditionText });
    iconContainer.append(conditionIcon);
    tempContainer.append(temp, tempSymbol, tempC, tempSymbolC);
    weatherNowContainer.append(locationMain, locationSub, tempContainer, iconContainer, conditionText, divider, dayTimeText, dateText);
    this.weatherContainer.append(weatherNowContainer);
  }

  displayTodayForecast(weatherToday) {
    const weatherTodayContainer = createDomElement({ elementTag: 'div', className: 'weather-today-container' });
    const heading = createDomElement({ elementTag: 'h3', className: 'sub-heading', textContent: 'Hourly Forecast' });
    const divider = createDomElement({ elementTag: 'div', className: 'divider' });
    weatherTodayContainer.append(heading, divider);
    weatherToday.forEach((element, i) => {
      const hourContainer = createDomElement({ elementTag: 'div', className: 'hour-container' });
      const time = createDomElement({ elementTag: 'p', className: 'time' });
      if (i === 0) {
        time.textContent = 'Now';
      } else {
        time.textContent = element.time.split(' ')[1];
      }

      const conditionIcon = createDomElement({ elementTag: 'img', className: 'icon', attr: { src: element.condition.icon } });
      const tempContainer = createDomElement({ elementTag: 'div', className: 'temp-container' });
      const temp = createDomElement({ elementTag: 'span', className: 'temp-f', textContent: element.temp_f, attr: { 'data-status': 'show' } });
      const tempSymbol = createDomElement({ elementTag: 'span', className: 'symbol', textContent: '\u2109', attr: { 'data-status': 'show' } });

      const tempC = createDomElement({ elementTag: 'span', className: 'temp-c', textContent: element.temp_c, attr: { 'data-status': 'hidden' } });
      const tempSymbolC = createDomElement({ elementTag: 'span', className: 'symbol', textContent: '\u2103', attr: { 'data-status': 'hidden' } });

      if (this.tempToggle.dataset.toggle === 'f') {
        tempC.style.display = 'none';
        tempSymbolC.style.display = 'none';
        temp.dataset.status = 'show';
        tempSymbol.dataset.status = 'show';
        tempC.dataset.status = 'hidden';
        tempSymbolC.dataset.status = 'hidden';
      } else if (this.tempToggle.dataset.toggle === 'c') {
        temp.style.display = 'none';
        tempSymbol.style.display = 'none';
        temp.dataset.status = 'hidden';
        tempSymbol.dataset.status = 'hidden';
        tempC.dataset.status = 'show';
        tempSymbolC.dataset.status = 'show';
      }

      tempContainer.append(temp, tempSymbol, tempC, tempSymbolC);
      hourContainer.append(time, conditionIcon, tempContainer);
      weatherTodayContainer.append(hourContainer);
    });

    this.weatherContainer.append(weatherTodayContainer);
  }

  displayFutureForecast(weatherFuture) {
    const weatherFutureContainer = createDomElement({ elementTag: 'div', className: 'future-container' });
    const heading = createDomElement({ elementTag: 'h3', className: 'sub-heading', textContent: '3-Day Forecast' });
    const divider = createDomElement({ elementTag: 'div', className: 'divider' });
    weatherFutureContainer.append(heading, divider);
    weatherFuture.forEach((element, i) => {
      const dayOfWeekContainer = createDomElement({ elementTag: 'div', className: 'day-container' });
      const date = new Date(`${element.date}T11:59:00`);
      const weekDay = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: weatherFuture.timeZone });
      const dayOfWeek = createDomElement({ elementTag: 'span', className: 'day-of-week' });
      if (i === 0) {
        dayOfWeek.textContent = 'Today';
      } else {
        dayOfWeek.textContent = weekDay;
      }

      const highTempContainer = createDomElement({ elementTag: 'div', className: 'high-temp-container' });
      const lowTempContainer = createDomElement({ elementTag: 'div', className: 'low-temp-container' });
      const highTemp = createDomElement({ elementTag: 'span', className: 'temp-high temp-f', textContent: `H: ${element.day.maxtemp_f}`, attr: { 'data-status': 'show' } });
      const lowTemp = createDomElement({ elementTag: 'span', className: 'temp-low temp-f', textContent: `L: ${element.day.mintemp_f}`, attr: { 'data-status': 'show' } });
      const tempSymbol = createDomElement({ elementTag: 'span', className: 'symbol', textContent: '\u2109', attr: { 'data-status': 'show' } });

      const highTempC = createDomElement({ elementTag: 'span', className: 'temp-high temp-c', textContent: `H: ${element.day.maxtemp_c}`, attr: { 'data-status': 'hidden' } });
      const lowTempC = createDomElement({ elementTag: 'span', className: 'temp-low temp-c', textContent: `L: ${element.day.mintemp_c}`, attr: { 'data-status': 'hidden' } });
      const tempSymbolC = createDomElement({ elementTag: 'span', className: 'symbol', textContent: '\u2103', attr: { 'data-status': 'hidden' } });

      if (this.tempToggle.dataset.toggle === 'f') {
        highTempC.style.display = 'none';
        lowTempC.style.display = 'none';
        tempSymbolC.style.display = 'none';
        highTemp.dataset.status = 'show';
        lowTemp.dataset.status = 'show';
        tempSymbol.dataset.status = 'show';
        highTempC.dataset.status = 'hidden';
        lowTempC.dataset.status = 'hidden';
        tempSymbolC.dataset.status = 'hidden';
      } else if (this.tempToggle.dataset.toggle === 'c') {
        highTemp.style.display = 'none';
        lowTemp.style.display = 'none';
        tempSymbol.style.display = 'none';
        highTemp.dataset.status = 'hidden';
        lowTemp.dataset.status = 'hidden';
        tempSymbol.dataset.status = 'hidden';
        highTempC.dataset.status = 'show';
        lowTempC.dataset.status = 'show';
        tempSymbolC.dataset.status = 'show';
      }

      const conditionIcon = createDomElement({ elementTag: 'img', className: 'icon', attr: { src: element.day.condition.icon } });

      highTempContainer.append(highTemp, tempSymbol.cloneNode('true'), highTempC, tempSymbolC.cloneNode('true'));
      lowTempContainer.append(lowTemp, tempSymbol.cloneNode('true'), lowTempC, tempSymbolC.cloneNode('true'));

      dayOfWeekContainer.append(dayOfWeek, conditionIcon, lowTempContainer, highTempContainer);
      weatherFutureContainer.append(dayOfWeekContainer);
    });
    this.weatherContainer.append(weatherFutureContainer);
  }

  toggleTempDisplay = () => {
    const toggleItems = document.querySelectorAll('.temp-c, .temp-f, .symbol');
    toggleItems.forEach((item) => {
      if (item.dataset.status === 'hidden') {
        item.dataset.status = 'show';
        item.style.display = 'inline';
      } else {
        item.dataset.status = 'hidden';
        item.style.display = 'none';
      }
    });

    if (this.tempToggle.dataset.toggle === 'f') {
      this.tempToggle.dataset.toggle = 'c';
      this.buttonC.classList.add('active-temp');
      this.buttonF.classList.remove('active-temp');
    } else {
      this.tempToggle.dataset.toggle = 'f';

      this.buttonF.classList.add('active-temp');
      this.buttonC.classList.remove('active-temp');
    }
  };

  displayLoadingScreen = () => {
    const loadingBackdrop = createDomElement({ elementTag: 'div', className: 'backdrop' });
    const loadingModal = createDomElement({ elementTag: 'div', className: 'loading' });
    const loadingAnimation = createDomElement({ elementTag: 'img', className: 'loading-animation', attr: { src: '../images/loading.gif' } });
    loadingModal.append(loadingAnimation);
    loadingBackdrop.append(loadingModal);
    this.body.append(loadingBackdrop);
  };

  undisplayLoadingScreen = () => {
    document.querySelector('.backdrop').remove();
  };

  displayError = () => {
    const message1 = 'Location not found.';
    const message2 = 'Search must be in the form of "Zip-Code", "City", "City, State" or "City, Country".';
    const errorContainer = createDomElement({ elementTag: 'div', className: 'error-container' });
    const errorMessage1 = createDomElement({ elementTag: 'p', className: 'error-message-1', textContent: message1 });
    const errorMessage2 = createDomElement({ elementTag: 'p', className: 'error-message-2', textContent: message2 });

    errorContainer.append(errorMessage1, errorMessage2);
    this.main.append(errorContainer);
  };

  removeError = () => {
    const errorMessage = document.querySelector('.error-container');
    if (errorMessage) {
      errorMessage.remove();
    }
  };
}

export { UserInterface };
