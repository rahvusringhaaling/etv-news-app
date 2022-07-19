import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import * as fs from 'fs';
import { IWeatherData } from './domain/IWeatherData';

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

const isDay = true;

const icons = {
  'clear': isDay ? 'paike' : 'kuu',
  'few clouds': isDay ? 'pilv_paike' : 'pilv_kuu',
  'variable clouds': isDay ? 'pilv_paike' : 'pilv_kuu',
  'cloudy with clear spells': isDay ? 'pilv_paike' : 'pilv_kuu',
  'overcast': 'pilv',
  'cloudy': 'pilv',
  'light snow shower': isDay ? 'pilv_paike_lumi' : 'pilv_kuu_lumi',
  'moderate snow shower': isDay ? 'pilv_paike_lumi' : 'pilv_kuu_lumi',
  'heavy snow shower': isDay ? 'pilv_paike_lumi' : 'pilv_kuu_lumi',
  'light shower': isDay ? 'pilv_paike_vihm' : 'pilv_kuu_vihm',
  'moderate shower': isDay ? 'pilv_paike_vihm' : 'pilv_kuu_vihm',
  'heavy shower': isDay ? 'pilv_paike_vihm' : 'pilv_kuu_vihm',
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

export async function getWeather() {
  const url = 'https://www.ilmateenistus.ee/ilma_andmed/xml/observations.php';
  const { data } = await axios.get<string>(url);
  const parser = new XMLParser();
  const weather: IWeatherData = parser.parse(data);

  console.log(icons['light shower'])
  console.log(icons['light shower'])
  console.log(icons['light shower'])

  if (!weather?.observations?.station) return;

  const { station: stations } = weather.observations
  const filtered = stations
    .filter(station => locations.has(station.name))
    .map(station => ({
      name: station.name,
      phenomenon: station.phenomenon,
      airTemperature: station.airtemperature
    }));

  console.log(filtered);
}