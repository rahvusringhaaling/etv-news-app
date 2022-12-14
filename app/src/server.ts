import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';
import * as express from 'express';
import { Server } from 'socket.io';
import { CasparCG, Options } from 'casparcg-connection';
import { getPortals, getFeeds } from './news'
import { getForecast, getObservationsCombined } from './weather';
import { IServerData } from './types/IServerData';
import { Language } from './types/Language';
import { ISettings } from './types/ISettings';
import { ILayers } from './types/ILayers';
import { IScheduleItem } from './types/IScheduleItem';

const webApp: express.Express = express();
const server = http.createServer(webApp);
webApp.use(express.static(path.join(__dirname, '../../template/dist')));

export let data: IServerData = {
  channel: 1,
  language: Language.Estonian
}

let layers: ILayers = {
  template: 100,
  templateKeyer: 99
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

let casparInfo: any;
let templateID: string;
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
    }, 250);
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
  socket.on('client/caspar/is-connected', (callback: Function) => {
    callback(connection.connected);
  });

  socket.on('template/template/heartbeat', (time: number) => {
    templateID = socket.id;
    socket.broadcast.emit('server/template/heartbeat', time);
  });

  socket.on('client/data/get', (callback: Function) => {
    callback(data);
  });

  socket.on('template/settings/get', (callback: Function) => {
    const settings: ISettings = {
      language: data.language,
      showForecast: data.weatherTable?.showForecast ?? false,
      showObservations: data.weatherTable?.showObservations ?? false,
    };
    callback(settings);
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

  socket.on(
    'template/portals/get',
    async (language: Language, callback: Function) => {
      callback(getPortals(language));
    }
  );

  socket.on('template/tv-feed/get', async (callback: Function) => {
    callback(await getFeeds());
  });

  socket.on(
    'template/weather-observations-combined/get',
    async (callback: Function) => {
      try {
        callback(await getObservationsCombined());
      } catch (error) {
        callback(null);
      }
    }
  );

  socket.on(
    'template/weather-forecast/get',
    async (language: Language, callback: Function) => {
      try {
        callback(await getForecast(language));
      } catch (error) {
        callback(null);
      }
    }
  );

  socket.on('client/schedule/get', () => {
    io.to(templateID).emit('server/schedule/get');
  });

  socket.on('template/schedule/post', (schedule: IScheduleItem[]) => {
    socket.broadcast.emit('server/schedule/post', schedule);
  });

  socket.on('client/current/get', () => {
    io.to(templateID).emit('server/current/get');
  });

  socket.on('template/current/post', (current: number) => {
    socket.broadcast.emit('server/current/post', current);
  });

  socket.on('client/schedule/next', () => {
    socket.broadcast.emit('server/schedule/next');
  });

  socket.on('client/schedule/initialize', () => {
    socket.broadcast.emit('server/schedule/initialize');
  });

  socket.on('client/init-time/get', () => {
    socket.broadcast.emit('server/init-time/get');
  });

  socket.on('template/init-time/post', (initTime: number) => {
    socket.broadcast.emit('server/init-time/post', initTime);
  });

  socket.on('client/data/save', (newData: IServerData) => {
    data = newData;
    fs.writeFile(DATA_FILE_NAME, JSON.stringify(newData, null, 4), (error) => {
      if (error) return logError('Error when saving file:\n' + error);
      console.log(`Successfully saved data to file: ${Object.keys(newData)}`);
    });
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
