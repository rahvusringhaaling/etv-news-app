import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { IForecastItem } from './domain/IForecastItem';
import { IObservationItem } from './domain/IObservationItem';
import { IWeatherForecast } from './domain/IWeatherForecast';
import { IWeatherObservations } from './domain/IWeatherObservations';

const locations = new Set([
  'Tallinn-Harku',
  'Jõhvi',
  'Jõgeva',
  'Tartu-Tõravere',
  'Võru',
  'Valga',
  'Türi',
  'Pärnu-Sauga',
  'Sõrve',
  'Ristna',
  'Lääne-Nigula',
  'Väike-Maarja'
]);

function getIcons(isNight: boolean | null = null) {
  if (isNight === null) {
    const date = new Date();
    const hour = date.getHours();
    const month: Number = date.getMonth();

    isNight =
      (hour > 15 || hour < 9) && month == 0 ||
      (hour > 16 || hour < 8) && month == 1 ||
      (hour > 17 || hour < 7) && month == 2 ||
      (hour > 20 || hour < 6) && month == 3 ||
      (hour > 21 || hour < 5) && month == 4 ||
      (hour > 22 || hour < 4) && month == 5 ||
      (hour > 22 || hour < 4) && month == 6 ||
      (hour > 21 || hour < 5) && month == 7 ||
      (hour > 20 || hour < 6) && month == 8 ||
      (hour > 18 || hour < 7) && month == 9 ||
      (hour > 16 || hour < 7) && month == 10 ||
      (hour > 15 || hour < 8) && month == 11;
  }

  return {
    'clear': isNight ? 'kuu' : 'paike',
    'few clouds': isNight ? 'pilv_kuu' : 'pilv_paike',
    'variable clouds': isNight ? 'pilv_kuu' : 'pilv_paike',
    'cloudy with clear spells': isNight ? 'pilv_kuu' : 'pilv_paike',
    'overcast': 'pilv',
    'cloudy': 'pilv',
    'light snow shower': isNight ? 'pilv_kuu_lumi' : 'pilv_paike_lumi',
    'moderate snow shower': isNight ? 'pilv_kuu_lumi' : 'pilv_paike_lumi',
    'heavy snow shower': isNight ? 'pilv_kuu_lumi' : 'pilv_paike_lumi',
    'light shower': isNight ? 'pilv_kuu_vihm' : 'pilv_paike_vihm',
    'moderate shower': isNight ? 'pilv_kuu_vihm' : 'pilv_paike_vihm',
    'heavy shower': isNight ? 'pilv_kuu_vihm' : 'pilv_paike_vihm',
    'light rain': 'pilv_vihm',
    'moderate rain': 'pilv_vihm',
    'heavy rain': 'pilv_vihm',
    'light sleet': 'pilv_lorts',
    'moderate sleet': 'pilv_lorts',
    'light snowfall': 'pilv_lumi',
    'moderate snowfall': 'pilv_lumi',
    'heavy snowfall': 'pilv_lumi',
    'blowing snow': 'pilv_lumi',
    'drifting snow': 'pilv_lumi',
    'snowstorm': 'pilv_lumi',
    'hail': 'pilv_rahe',
    'mist': 'udu',
    'fog': 'udu',
    'thunder': 'pilv_aike',
    'thunderstorm': 'pilv_aike_vihm'
  }
}
const parser = new XMLParser();

export async function getObservations(): Promise<IObservationItem[] | null> {
  const url = 'https://www.ilmateenistus.ee/ilma_andmed/xml/observations.php';
  const { data } = await axios.get<string>(url);

  const weather: IWeatherObservations = parser.parse(data);
  if (!weather?.observations?.station) return null;
  const { station: stations } = weather.observations;

  const icons = getIcons();

  return stations
    .filter((station) => locations.has(station.name))
    .map((station) =>
      station.phenomenon.length > 0
        ?
        {
          name: station.name,
          phenomenon: station.phenomenon,
          icon: icons[station.phenomenon.toLocaleLowerCase()],
          airTemperature: station.airtemperature
        }
        :
        {
          name: station.name,
          airTemperature: station.airtemperature
        }
    );
}

export async function getForecast(): Promise<IForecastItem[] | null> {
  const url = 'https://www.ilmateenistus.ee/ilma_andmed/xml/forecast.php';
  const { data } = await axios.get<string>(url);

  const weather: IWeatherForecast = parser.parse(data);
  if (!weather.forecasts?.forecast) return null;
  const { forecast } = weather.forecasts;

  const dayIcons = getIcons(false);
  const nightIcons = getIcons(true);

  return forecast.map((item) => ({
    night: {
      phenomenon: item.night.phenomenon,
      icon: nightIcons[item.night.phenomenon.toLocaleLowerCase()],
      tempMin: item.night.tempmin,
      tempMax: item.night.tempmax,
      text: item.night.text
    },
    day: {
      phenomenon: item.day.phenomenon,
      icon: dayIcons[item.day.phenomenon.toLocaleLowerCase()],
      tempMin: item.day.tempmin,
      tempMax: item.day.tempmax,
      text: item.day.text
    }
  }));
}
