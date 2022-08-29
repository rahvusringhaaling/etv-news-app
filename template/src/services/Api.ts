import { io, Socket } from 'socket.io-client';
import { get } from 'svelte/store';
import type { IFeed } from '../domain/IFeed';
import type { IForecastItem } from '../domain/IForecastItem';
import type { IPortal } from '../domain/IPortal';
import { index } from '../stores/current';
import { schedule } from '../stores/schedule';
import type { IObservationsMap } from '../domain/IObservationsMap';
import type { IObservationsCombined } from 'src/domain/IObservationsCombined';
import type { Language } from 'src/domain/Language';

export class Api {
  private socket: Socket;

  constructor(next: Function, initialize: Function, getInitTime: Function) {
    const port = import.meta.env.PROD ? window.location.port : '8000';
    this.socket = io(`ws://localhost:${port}`);

    this.socket.on('server/schedule/get', () => {
      this.socket.emit('template/schedule/post', get(schedule));
    });

    this.socket.on('server/current/get', () => {
      this.socket.emit('template/current/post', get(index));
    });

    this.socket.on('server/schedule/next', () => {
      next();
    });

    this.socket.on('server/schedule/initialize', () => {
      initialize();
    });

    this.socket.on('server/init-time/get', () => {
      this.socket.emit('template/init-time/post', getInitTime());
    });

    index.subscribe(index => {
      this.socket.emit('template/current/post', index);
    });
  }

  getPortals() {
    return new Promise<IPortal[]>(resolve => {
      this.socket.emit('template/portals/get', (portals: IPortal[]) => {
        resolve(portals);
      });
    });
  }

  getTVFeed() {
    return new Promise<IFeed>(resolve => {
      this.socket.emit('template/tv-feed/get', (feed: IFeed) => {
        resolve(feed);
      });
    });
  }

  getWeatherObservations() {
    return new Promise<IObservationsCombined | null>((resolve) => {
      this.socket.emit(
        'template/weather-observations-combined/get',
        (observationsCombined: IObservationsCombined | null) => {
          resolve(observationsCombined);
        }
      );
    });
  }

  getWeatherObservationsMap() {
    return new Promise<IObservationsMap | null>((resolve) => {
      this.socket.emit(
        'template/weather-observations-map/get',
        (observations: IObservationsMap | null) => {
          resolve(observations);
        }
      );
    });
  }

  getWeatherForecast(language: Language) {
    return new Promise<IForecastItem[] | null>(resolve => {
      this.socket.emit(
        'template/weather-forecast/get',
        language,
        (forecast: IForecastItem[] | null) => {
          console.log('forecast api', forecast);

          resolve(forecast);
        }
      );
    });
  }

  sendSchedule() {
    this.socket.emit('template/schedule/post', get(schedule));
  }

  sendHeartbeat() {
    this.socket.emit('template/template/heartbeat', Date.now());
  }
}
