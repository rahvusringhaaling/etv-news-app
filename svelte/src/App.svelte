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
  import { sleep } from './utils';
  import type { IScheduleItem } from './domain/IScheduleItem';
  import { observations } from './stores/weather';

  let articles: any[] = [];
  let rawSchedule: IScheduleItem[][];
  let api = new Api(() => next());
  let timeout: NodeJS.Timeout;

  onMount(() => {
    api.sendHeartbeat();
    setInterval(() => api.sendHeartbeat(), 3000);

    initialize();
  });

  async function initialize() {
    const observationsData = await api.getWeatherObservations();
    if (observationsData) {
      observations.set(observationsData);
    }

    feed.set(await api.getTVFeed());
    const newPortals = (await api.getPortals()).map((portal, i) => ({
      ...portal,
      backgroundColor: hexToRgba(portal.primaryColor),
      index: i
    }));
    portals.set(newPortals);

    articles = $portals.flatMap((portal) =>
      $feed[portal.portal].flatMap((article) => ({ article, portal }))
    );
    rawSchedule = Array(articles.length)
      .fill(null)
      .map((_) => []);

    await sleep(0);
    articles = [];
    const newSchedule = rawSchedule
      .flat()
      .map((item, index) => ({ ...item, index }));

    current.set(0);
    schedule.set(newSchedule);

    const scheduleSet = new Set($schedule.map((item) => item.name));
    for (const portal in $feed) {
      $feed[portal] = $feed[portal].filter((item) =>
        scheduleSet.has(item.header)
      );
    }

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

  // #2E3192 => rgba(46, 49, 146, 0.1)
  function hexToRgba(hex: string) {
    const integer = parseInt(hex.substring(1), 16);
    const r = (integer >> 16) & 255;
    const g = (integer >> 8) & 255;
    const b = integer & 255;
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
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
