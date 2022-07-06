<script lang="ts">
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import ArticleContainer from './components/Content/ArticleContainer.svelte';
  import Right from './components/Right/RightContainer.svelte';
  import { Api } from './services/Api';
  import { portals } from './stores/portals';
  import { feed } from './stores/feed';
  import { schedule } from './stores/schedule';
  import { current } from './stores/current';
  import ScheduleBuilder from './components/Content/Builder/ScheduleBuilder.svelte';
  import { sleep } from './utils';
  import type { IScheduleItem } from './domain/IScheduleItem';

  let articles: any[] = [];
  let rawSchedule: IScheduleItem[][];
  let api = new Api();
  let timeout: NodeJS.Timeout;

  onMount(async () => {
    api.sendHeartbeat();
    setInterval(() => api.sendHeartbeat(), 3000);

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
    const newSchedule = rawSchedule.flat();

    schedule.set(newSchedule);
    api.sendSchedule();
    console.log($schedule);

    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        current.next();
      }
    });

    current.subscribe((item) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        current.next();
      }, item.duration * 1000);
    });
  });

  // #2E3192 => rgba(46, 49, 146, 0.1)
  function hexToRgba(hex: string) {
    const integer = parseInt(hex.substring(1), 16);
    const r = (integer >> 16) & 255;
    const g = (integer >> 8) & 255;
    const b = integer & 255;
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }
</script>

<main>
  <div class="root-container" style="">
    <Header />
    <div class="bottom-container">
      <ArticleContainer />
      <Right />
    </div>
  </div>
  {#if articles.length > 0}
    <!-- <ScheduleBuilder input={articles[0]} bind:output={cache[0]} /> -->

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
