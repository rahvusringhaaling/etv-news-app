import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { IFilteredObservationItem } from './domain/IFilteredObservationItem';
import { IForecastItem } from './domain/IForecastItem';
import { IObservationItem } from './domain/IObservationItem';
import { IObservationsMap } from './domain/IObservationsMap';
import { IObservationsTimestamp } from './domain/IObservationsTimestamp';
import { IWeatherForecast } from './domain/IWeatherForecast';
import { IWeatherObservations } from './domain/IWeatherObservations';

const locations = new Map([
  ['Tallinn-Harku', [655, 172]],
  ['Jõhvi', [1164, 180]],
  ['Jõgeva', [1085, 390]],
  ['Tartu-Tõravere', [999, 528]],
  ['Võru', [1180, 681]],
  ['Valga', [852, 699]],
  ['Türi', [787, 360]],
  ['Pärnu-Sauga', [634, 494]],
  ['Sõrve', [200, 649]],
  ['Ristna', [201, 331]],
  ['Lääne-Nigula', [506, 315]],
  ['Väike-Maarja', [944, 266]],
])
const parser = new XMLParser();

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

export async function getObservations(): Promise<IObservationsTimestamp | null> {
  const url = 'https://www.ilmateenistus.ee/ilma_andmed/xml/observations.php';
  const { data } = await axios.get<string>(url);

  const weather: IWeatherObservations = parser.parse(data);
  const regex = /<observations timestamp="(\d+)">/
  const match = data.match(regex);
  const timestamp = match ? parseInt(match[1]) : null;

  if (!weather?.observations?.station) return null;
  const { station: stations } = weather.observations;

  const icons = getIcons();
  const observations = stations
    .map((station) => {
      const temp = typeof station.airtemperature === 'number'
        ? station.airtemperature
        : null;
      return station.phenomenon.length > 0
        ?
        {
          name: station.name,
          phenomenon: station.phenomenon,
          icon: icons[station.phenomenon.toLocaleLowerCase()],
          airTemperature: temp
        }
        :
        {
          name: station.name,
          airTemperature: temp
        }
    });

  return { timestamp, observations }
}

export async function getObservationsMap(): Promise<IObservationsMap | null> {
  const result = await getObservations();
  if (!result) return null;
  const { timestamp, observations } = result;

  const observationsFiltered = observations
    .filter(
      (station) => station.airTemperature && locations.has(station.name)
    )
    .map(station => {
      const [x, y] = locations.get(station.name)!
      return { ...station, x, y };
    });

  return { timestamp, observations: observationsFiltered }
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
