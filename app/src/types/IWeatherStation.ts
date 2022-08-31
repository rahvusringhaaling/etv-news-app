export interface IWeatherStation {
  name: string;
  wmocode: string;
  longitude: number;
  latitude: number;
  phenomenon: string;
  visibility: string;
  precipitations: string;
  airpressure: string;
  relativehumidity: number;
  airtemperature: number;
  winddirection: string;
  windspeed: string;
  windspeedmax: string;
  waterlevel: string;
  waterlevel_eh2000: string;
  watertemperature: string;
  uvindex: string;
}