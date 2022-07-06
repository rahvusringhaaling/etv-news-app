import { Injectable } from '@angular/core';
import { ipcRenderer } from 'electron';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private ipcRenderer: typeof ipcRenderer;
  private socket;
  private serverData: object;
  private _port: number;

  get port() {
    return this._port;
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;

      this._port = this.ipcRenderer.sendSync('get-server-port');
      this.socket = io(`ws://localhost:${this._port}`);
    }
  }

  onError() {
    this.socket.on('server/error', (message: string) => {
      console.error('Server side error:');
      console.error(message);
    });
  }

  isCasparConnected() {
    return new Promise<boolean>(resolve => {
      this.socket.emit('client/caspar/is-connected', (value: boolean) => {
        resolve(value);
      });
    });
  }

  onTemplateHeartbeat(callback: Function) {
    this.socket.on('server/template/heartbeat', callback)
  }

  onTemplateSchedule(callback: Function) {
    this.socket.on('server/schedule/post', callback)
  }

  requestTemplateSchedule() {
    this.socket.emit('client/schedule/get');
  }

  onTemplateCurrent(callback: Function) {
    this.socket.on('server/current/post', callback)
  }

  requestTemplateCurrent() {
    this.socket.emit('client/current/get');
  }

  sendScheduleNext() {
    this.socket.emit('client/schedule/next');
  }

  getCasparLocation() {
    return new Promise<string>(resolve => {
      this.socket.emit('client/caspar-media-location/get', (path: string) => {
        resolve(path);
      })
    });
  }

  getLayers() {
    return new Promise<object>(resolve => {
      this.socket.emit('client/layers/get', (layers: object) => {
        resolve(layers);
      })
    });
  }

  addTitle(data: { firstRow: string, secondRow: string }) {
    this.socket.emit('client/title/add', data);
  }

  removeTitle() {
    this.socket.emit('client/title/remove');
  }

  getServerData() {
    return new Promise<object>(resolve => {
      if (this.serverData) {
        console.log('%c CACHED DATA: ', 'background: #222; color: #bada55', this.serverData);
        resolve(this.serverData);
        return;
      }

      this.socket.emit('client/data/get', (serverData) => {
        console.log('%c SERVER DATA: ', 'background: #222; color: #bada55', serverData);
        this.serverData = serverData;
        resolve(serverData);
      });
    });
  }

  saveData(data: any) {
    this.socket.emit('client/data/save', data);
  }

  getImage() {
    return new Promise<string>(resolve => {
      this.socket.emit('client/dialog/image', (uri: string) => {
        resolve(uri);
      });
    });
  }
}
