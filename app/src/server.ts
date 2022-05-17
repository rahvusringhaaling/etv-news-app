import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as express from 'express';
import * as dgram from 'dgram';
import * as net from 'net';
import { Server } from 'socket.io';
import { CasparCG, Options } from 'casparcg-connection';
import { test } from './news'

// test();

const webApp: any = express();
const server = http.createServer(webApp);
webApp.use(express.static(path.join(__dirname, '../../svelte/public')));

interface Data {
  channel: number
}

interface Layers {
  [key: string]: number;
}

let data: Data = {
  channel: 1
}

let layers: Layers = {
  template: 110,
  archive: 102,
  video: 101,
  efect: 90,
  efect16by9: 99,
  creditsBG: 120,
  creditsText: 121
}

const DATA_FILE_NAME = 'data.json';
loadServerData();

const ip = '127.0.0.1';
export let port = 8000;
(async () => {
  while (true) {
    if (!await isPortReachable(port, ip)) {
      break;
    }

    port++;
  }

  const index = port - 8000;
  for (const key in layers) {
    layers[key] = layers[key] + 1000 * 2 * (index + 1);
  }

  server.listen(port, () => {
    console.log(`\n  Listening on *:${port}`);
  });
})();

const io = new Server(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e8
});

let casparInfo;
const connection: CasparCG = new CasparCG({
  autoConnect: true,
  autoReconnect: true,
  queueMode: Options.QueueMode.SEQUENTIAL,
  onConnected: () => {
    connection.infoPaths().then(value => {
      casparInfo = value.response.data;
    });

    setTimeout(() => {
      clearLayers();

      connection
        .loadHtmlPageBgAuto(
          data.channel, layers.template, `http://${ip}:${port}?${Date.now()}`
        )
        .then()
        .catch(error => logError(error));
    }, 2000);
  }
});

export function clearLayers() {
  for (const layer in layers) {
    connection
      .clear(data.channel, layers[layer])
      .catch(error => logError(error));
    connection
      .mixerClear(data.channel, layers[layer])
      .catch(error => logError(error));
  }
}

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('client/caspar/is-connected', (callback: Function) => {
    callback(connection.connected);
  });

  socket.on('template/template/heartbeat', (time: number) => {
    socket.broadcast.emit('server/template/heartbeat', time);
  });

  socket.on('client/data/get', (callback: Function) => {
    callback(data);
  });

  socket.on('client/layers/get', (callback: Function) => {
    callback(layers);
  });

  socket.on('client/caspar-media-location/get', async (callback: Function) => {
    if (!casparInfo) {
      logError('Missing CasparCG info.');
      callback(null);
      return;
    }

    const location = path.join(casparInfo.root, casparInfo.media);
    callback(location);
  });

  socket.on('client/title/add', titleData => {
    console.log('client/title/add');

    console.log(titleData);
    
    socket.broadcast.emit('server/title/add', titleData);
  });

  socket.on('client/title/remove', () => {
    console.log('client/title/remove');
    
    socket.broadcast.emit('server/title/remove');
  });

  saveData(socket);

  socket.on('client/clock/send', (time: number) => {
    const clockIP = '127.0.0.1';
    const clockPort = 5555;

    const udp = dgram.createSocket('udp4');
    const message = '<andmed><kell>' + time + '</kell></andmed>';
    udp.send(Buffer.from(message), clockPort, clockIP);
  });
});

function logError(message) {
  console.error('\nSomething went wrong.')
  console.log('\x1b[31m%s\x1b[0m', message);
  io.emit('server/error', message);
}

function loadServerData() {
  try {
    const fileData = fs.readFileSync(DATA_FILE_NAME, { encoding: 'utf8' });
    data = { ...data, ...JSON.parse(fileData) };
    console.log('\n\nData loaded from disk');
  } catch (error) {
    console.log('\n\nData file is missing!');
  }
}

function saveData(socket) {
  socket.on('client/data/save', (newData) => {
    data = newData;
    fs.writeFile(DATA_FILE_NAME, JSON.stringify(newData, null, 4), (error) => {
      if (error) return logError('Error when saving file:\n' + error);
      console.log(`Successfully saved data to file: ${Object.keys(newData)}`);
    });
  });
}

async function isPortReachable(port: number, host: string, timeout = 500) {
  const promise = new Promise<void>((resolve, reject) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(timeout);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve();
    });
  });

  try {
    await promise;
    return true;
  } catch {
    return false;
  }
}
