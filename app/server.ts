import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as express from 'express';
import * as dgram from 'dgram';
import { Server } from "socket.io";
import { CasparCG, Enum, Options } from 'casparcg-connection';

const webApp: any = express();
const server = http.createServer(webApp);
webApp.use(express.static(path.join(__dirname, '../../svelte/public')));

interface Data {
  channel: number,
  layers: {
    template: number,
    video: number,
    opener: number,
  },
  settings?: {
    port?: number
  }
}

let data: Data = {
  channel: 1,
  layers: {
    template: 110,
    video: 101,
    opener: 90,
  }
};
const DATA_FILE_NAME = 'data.json';
loadServerData();

export let port = 8089;
try {
  let newPort = data.settings.port;
  if (newPort > 0 && newPort <= 65535 && newPort !== 4200) {
    port = newPort;
  }
} catch (error) {
  console.log('ERROR:');
  console.log(error.name);
} finally {
  if (!data.settings) {
    data.settings = {};
  }
  data.settings.port = port;
}

server.listen(port, () => {
  console.log(`\n  Listening on *:${port}`);
});

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
    clearLayers();

    setTimeout(() => {
      connection
        .loadHtmlPageBgAuto(
          data.channel, data.layers.template, `http://127.0.0.1:${port}?${Date.now()}`
        )
        .then()
        .catch(error => logError(error));
    }, 4000);
  }
});

export function clearLayers() {
  for (const layer in data.layers) {
    connection
      .clear(data.channel, data.layers[layer])
      .then()
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

  socket.on('client/title/add', titleData => {
    socket.broadcast.emit('server/title/add', titleData);
  });

  socket.on('client/title/remove', () => {
    socket.broadcast.emit('server/title/remove');
  });

  socket.on('client/opener/add', (removeLastFrame: boolean) => {
    connection
      .play(
        data.channel,
        data.layers.opener,
        'TartuMaraton2022/SkiClassics_2021_OPENER_220113'
      )
      .catch(error => logError(error));

    if (removeLastFrame) {
      connection
        .loadbgAuto(data.channel,
          data.layers.opener,
          '#00000000',
          false,
          Enum.Transition.CUT
        )
        .catch(error => logError(error));
    }
  });

  socket.on('client/opener/remove', () => {
    connection
      .stop(data.channel, data.layers.opener)
      .catch(error => logError(error));
  });

  socket.on('client/clock/send', (time: number) => {
    const clockIP = '127.0.0.1';
    const clockPort = 5555;

    const udp = dgram.createSocket('udp4');
    const message = '<andmed><kell>' + time + '</kell></andmed>';
    udp.send(Buffer.from(message), clockPort, clockIP);
  });

  saveData(socket);
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
