<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import ArticleContainer from './components/Content/ArticleContainer.svelte';
  import Right from './components/Right/RightContainer.svelte';
  import { Api } from './services/Api';
  import { portals } from './stores/portals';
  import { feed } from './stores/feed';
  import { schedule } from './stores/schedule';
  import { current, index } from './stores/current';
  import ScheduleBuilder from './components/Content/Builder/ScheduleBuilder.svelte';
  import { getWeekDay, hexToRgba, sleep } from './utils';
  import { ScheduleType, type IScheduleItem } from './domain/IScheduleItem';
  import { forecast, observations, observationsMap } from './stores/weather';
  import type { IPortal } from './domain/IPortal';
  import { language } from './stores/language';
  import { Language } from './domain/Language';

  let articles: any[] = [];
  let rawSchedule: IScheduleItem[][];
  let api = new Api(
    () => next(),
    () => initialize(),
    () => getInitTime()
  );
  let timeout: NodeJS.Timeout;
  let initTime = 0;

  onMount(() => {
    api.sendHeartbeat();
    setInterval(() => api.sendHeartbeat(), 3000);

    initialize();
  });

  async function initObservations(): Promise<IPortal> {
    const observationsCombined = await api.getWeatherObservations();
    if (observationsCombined) {
      observations.set(observationsCombined.observations);
      observationsMap.set(observationsCombined.observationsMap);
    }

    feed.set(await api.getTVFeed());
    const newPortals = (await api.getPortals()).map((portal, i) => ({
      ...portal,
      backgroundColor: hexToRgba(portal.primaryColor),
      index: i,
    }));
    portals.set(newPortals);

    const weather = $portals.find((portal) => portal.name === 'ilm');
    current.set(0);
    schedule.set([
      {
        index: 0,
        portal: weather!,
        type: ScheduleType.WeatherObservation,
        name: `Faktiline ilm kell ${new Date().getHours()}:00`,
        duration: 30,
      },
    ]);

    return weather;
  }

  async function initForecast() {
    const forecastData = await api.getWeatherForecast($language);
    if (forecastData) {
      forecast.set(forecastData);
    }

    const weather = $portals.find((portal) => portal.name === 'ilm');
    const weatherSchedule: IScheduleItem[] = [
      {
        index: 1,
        portal: weather!,
        type: ScheduleType.WeatherForecast,
        name: `Nelja päeva prognoos`,
        duration: 30,
      },
    ];

    for (let i = 0; i < 4; i++) {
      weatherSchedule.push({
        index: i + 2,
        portal: weather!,
        type: ScheduleType.WeatherForecastDay,
        name: `Detailne prognoos - ${getWeekDay(
          new Date($forecast[i].date),
          $language
        )}`,
        forecast: $forecast[i],
        duration: 30,
      });
    }
    $schedule.push(...weatherSchedule);
  }

  async function initNews() {
    articles = $portals
      .filter((portal) => portal.name !== 'ilm')
      .flatMap((portal) =>
        $feed[portal.portal].flatMap((article) => ({ article, portal }))
      );
    rawSchedule = Array(articles.length)
      .fill(null)
      .map((_) => []);

    await sleep(0);
    articles = [];
    let newsSchedule = rawSchedule
      .flat()
      .map((item, index) => ({ ...item, index: index + 6 }));

    $schedule.push(...newsSchedule);

    const scheduleSet = new Set($schedule.map((item) => item.name));
    for (const portal in $feed) {
      $feed[portal] = $feed[portal].filter((item) =>
        scheduleSet.has(item.header)
      );
    }
  }

  async function initialize() {
    if (initTime === -1) return;
    initTime = -1;
    language.set(Language.Russian);
    await initObservations();
    api.sendSchedule();
    await initForecast();
    api.sendSchedule();
    await initNews();
    api.sendSchedule();

    initTime = Date.now();
    api.sendSchedule();
    console.log($schedule);
  }

  const unsubscribe = current.subscribe((item) => {
    if (!item) return;

    clearTimeout(timeout);
    timeout = setTimeout(() => next(), item.duration * 1000);
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      next();
    }
  }

  function next() {
    if ($index === $schedule.length - 1) {
      initialize();
    } else {
      current.next();
    }
  }

  function getInitTime(): number {
    return initTime;
  }

  onDestroy(unsubscribe);
</script>

<svelte:window on:keypress={handleKeyDown} />

<main>
  <div class="root-container" style="">
    <Header />
    <div class="bottom-container">
      <ArticleContainer />
      <Right />
    </div>
  </div>
  {#if articles.length > 0}
    {#each articles as article, i}
      <ScheduleBuilder input={article} bind:output={rawSchedule[i]} />
    {/each}
  {/if}
</main>

<style>
  .root-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #dddddd;
    max-width: 1920px;
    max-height: 1080px;
  }

  .bottom-container {
    display: flex;
  }
</style>
