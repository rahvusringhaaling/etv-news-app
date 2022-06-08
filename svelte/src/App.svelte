<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import Content from './components/Content/ContentContainer.svelte';
  import Right from './components/Right/RightContainer.svelte';
  import { Api } from './services/Api';
  import { portals } from './stores/portals';
  import { feed } from './stores/feed';
  import { IScheduleItem, ScheduleType } from './domain/IScheduleItem';
  import { schedule } from './stores/schedule';
  import { current } from './stores/current';

  onMount(async () => {
    Api.sendHeartbeat();
    setInterval(Api.sendHeartbeat, 3000);

    feed.set(await Api.getTVFeed());
    const newPortals = (await Api.getPortals()).map((portal, i) => ({
      ...portal,
      backgroundColor: hexToRgba(portal.primaryColor),
      index: i
    }));
    portals.set(newPortals);

    const newSchedule = $portals.flatMap((portal) =>
      $feed[portal.portal].flatMap((article) => [
        {
          portal: portal,
          type: ScheduleType.Headline,
          pageNumber: 1,
          name: article.header,
          article: article,
          duration: 9
        },
        {
          portal: portal,
          type: ScheduleType.Text,
          name: article.header,
          article: article,
          duration: 28
        }
      ])
    );
    schedule.set(newSchedule);
    console.log($schedule);

    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        current.next();
      }
    });
  });

  const unsubscribe = current.subscribe((item) => {
    if (!item) return;
    // const { primaryColor, textColor } = $portals[item.portal];
    // setColors(primaryColor, textColor);
  });

  // #2E3192 => rgba(46, 49, 146, 0.1)
  function hexToRgba(hex: string) {
    const integer = parseInt(hex.substring(1), 16);
    const r = (integer >> 16) & 255;
    const g = (integer >> 8) & 255;
    const b = integer & 255;
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }

  function setColors(primaryColor: string, textColor: string) {
    const root = document.querySelector(':root') as HTMLElement;
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--background-color', hexToRgba(primaryColor));
    root.style.setProperty('--text-color', textColor);
  }

  onDestroy(unsubscribe);
</script>

<main>
  <div class="root-container" style="">
    <Header />
    <div class="bottom-container">
      <Content />
      <Right />
    </div>
  </div>
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
