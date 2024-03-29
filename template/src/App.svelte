<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import ArticleContainer from './components/Content/ContentContainer.svelte';
  import Right from './components/Right/RightContainer.svelte';
  import { Api } from './services/Api';
  import { portals } from './stores/portals';
  import { feed } from './stores/feed';
  import { schedule } from './stores/schedule';
  import { current, index } from './stores/current';
  import ScheduleBuilder from './components/Content/Builder/ScheduleBuilder.svelte';
  import { getWeekDay, hexToRgba, sleep } from './utils';
  import { ScheduleType, type IScheduleItem } from './types/IScheduleItem';
  import { forecast, observations, observationsMap } from './stores/weather';
  import { language } from './stores/language';
  import { Language } from './types/Language';
  import type { IArticlePortalWrapper } from './types/IArticlePortalWrapper';

  let fontFamily = 'AvenirNextLTPro';
  let articles: IArticlePortalWrapper[] = [];
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

  async function setLanguage(value: Language) {
    language.set(value);
    fontFamily =
      value === Language.Estonian ? 'AvenirNextLTPro' : 'AvenirNextCyr';
  }

  async function initData(): Promise<boolean> {
    const observationsCombined = await api.getWeatherObservations();
    if (observationsCombined) {
      observations.set(observationsCombined.observations);
      observationsMap.set(observationsCombined.observationsMap);
    }

    const newPortals = (await api.getPortals($language)).map((portal, i) => ({
      ...portal,
      backgroundColor: hexToRgba(portal.primaryColor),
      index: i,
    }));
    portals.set(newPortals);
    feed.set(await api.getTVFeed());

    return !!observationsCombined;
  }

  async function initObservations() {
    const weather = $portals.find((portal) => portal.portal === 'ilm');
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
  }

  async function initForecast(isFirst: boolean): Promise<boolean> {
    const forecastData = await api.getWeatherForecast($language);
    if (!forecastData) return false;

    forecast.set(forecastData);

    const weather = $portals.find((portal) => portal.portal === 'ilm');
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
    if (isFirst) {
      current.set(0);
      schedule.set([...weatherSchedule]);
    } else {
      $schedule.push(...weatherSchedule);
    }
    return true;
  }

  async function initNews(isFirst: boolean) {
    articles = $portals
      .filter((portal) => portal.portal !== 'ilm')
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

    if (isFirst) {
      current.set(0);
      schedule.set([...newsSchedule]);
    } else {
      $schedule.push(...newsSchedule);
    }

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
    const { language, showObservations, showForecast } =
      await api.getSettings();
    await setLanguage(language);
    const observationsSuccess = await initData();

    if (showObservations && observationsSuccess) {
      await initObservations();
      api.sendSchedule();
    }
    let forecastSuccess = true;
    if (showForecast) {
      forecastSuccess = await initForecast(
        !showObservations || !observationsSuccess
      );
      api.sendSchedule();
    }
    const isNewsFirst =
      (!showObservations && !showForecast) ||
      (!observationsSuccess && !forecastSuccess) ||
      (!showObservations && !forecastSuccess) ||
      (!observationsSuccess && !showForecast);
    await initNews(isNewsFirst);
    api.sendSchedule();

    initTime = Date.now();
    api.sendSchedule();
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

<main style="--font-family: {fontFamily};">
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
