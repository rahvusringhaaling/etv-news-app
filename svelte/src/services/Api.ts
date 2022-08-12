import { io } from 'socket.io-client';
import { get } from 'svelte/store';
import type { IFeed } from '../domain/IFeed';
import type { IObservationItem } from '../domain/IObservationItem';
import type { IForecastItem } from '../domain/IForecastItem';
import type { IPortal } from '../domain/IPortal';
import { index } from '../stores/current';
import { schedule } from '../stores/schedule';
import type { IFilteredObservationItem } from '../domain/IFilteredObservationItem';
import type { IObservationsMap } from '../domain/IObservationsMap';

export class Api {
  private socket = io(`ws://localhost:${window.location.port}`);

  constructor(next: Function) {
    this.socket.on('server/schedule/get', () => {
      this.socket.emit('template/schedule/post', get(schedule));
    });

    this.socket.on('server/current/get', () => {
      this.socket.emit('template/current/post', get(index));
    });

    this.socket.on('server/schedule/next', () => {
      next();
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
    return new Promise<IObservationItem[] | null>((resolve) => {
      this.socket.emit(
        'template/weather-observations/get',
        (observations: IObservationItem[] | null) => {
          resolve(observations);
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

  getWeatherForecast() {
    return new Promise<IForecastItem[] | null>(resolve => {
      this.socket.emit(
        'template/weather-forecast/get',
        (forecast: IForecastItem[] | null) => {
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
