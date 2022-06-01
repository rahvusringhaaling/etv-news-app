import { io } from 'socket.io-client';
import type { IFeed } from '../domain/IFeed';
import type { IPortal } from '../domain/IPortal';

export class Api {
  private static socket = io(`ws://localhost:${window.location.port}`);

  static getPortals() {
    return new Promise<IPortal[]>(resolve => {
      Api.socket.emit('portals/get', (portals: IPortal[]) => {
        resolve(portals);
      });
    });
  }

  static getTVFeed() {
    return new Promise<IFeed>(resolve => {
      Api.socket.emit('tv-feed/get', (feed: IFeed) => {
        resolve(feed);
      });
    });
  }

  static sendHeartbeat() {
    Api.socket.emit('template/template/heartbeat', Date.now());
  }
}
