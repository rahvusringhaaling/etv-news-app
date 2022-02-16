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

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;

      const port = this.ipcRenderer.sendSync('get-server-port');
      console.log(`WebSocket port: ${port}`);
      this.socket = io(`ws://localhost:${port}`);
    }
  }

  onError() {
    this.socket.on('server/error', (message) => {
      console.error('Server side error:');
      console.error(message);
    });
  }

  isCasparConnected(callback: Function) {
    this.socket.emit('client/caspar/is-connected', (value: boolean) => {
      callback(value);
    });
  }

  isTemplateConnected(callback: Function) {
    this.socket.emit('client/template/is-connected', (value: boolean) => {
      callback(value);
    });
  }

  onTemplateHeartbeat(callback: Function) {
    this.socket.on('server/template/heartbeat', callback)
  }

  addTitle(data: { firstRow: string, secondRow: string }) {
    this.socket.emit('client/title/add', data);
  }

  removeTitle() {
    this.socket.emit('client/title/remove');
  }

  addOpener(removeLastFrame: boolean) {
    this.socket.emit('client/opener/add', removeLastFrame);
  }

  removeOpener() {
    this.socket.emit('client/opener/remove');
  }

  getServerData(callback: Function) {
    if (this.serverData) {
      console.log('%c CACHED DATA: ', 'background: #222; color: #bada55');
      console.log(this.serverData);
      callback(this.serverData);
      return;
    }

    this.socket.emit('client/data/get', (serverData) => {
      console.log('%c SERVER DATA: ', 'background: #222; color: #bada55');
      console.log(serverData);
      this.serverData = serverData;
      callback(serverData);
    });
  }

  saveData(data: any) {
    this.socket.emit('client/data/save', data);
  }

  getImage(callback: Function) {
    this.socket.emit('client/dialog/image', (uri: string) => {
      callback(uri);
    })
  }
}
