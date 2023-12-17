import { WeatherForecast } from './model';
import { UserInterface } from './view';
import { Controller } from './controller';
import './styles.css';

const app = new Controller(new UserInterface(), new WeatherForecast());
app.handleWeatherData('austin');
