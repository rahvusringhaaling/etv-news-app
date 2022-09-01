<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { gsap } from 'gsap';
  import SideBar from './SideBar.svelte';
  import Headline from './Headline.svelte';
  import { sleep } from '../../utils';
  import { current, next, previous } from '../../stores/current';
  import { ScheduleType } from '../../types/IScheduleItem';
  import Article from './Article/Article.svelte';
  import WeatherMap from './Weather/WeatherMap/WeatherMap.svelte';
  import WeatherForecast from './Weather/WeatherForecast.svelte';
  import WeatherForecastDay from './Weather/WeatherForecastDay.svelte';
  import type { IForecastItem } from '../../types/IForecastItem';

  interface IPage {
    type: ScheduleType;
    forecast?: IForecastItem;
    container: HTMLElement | null;
    component: Headline | null;
  }

  let bar: HTMLElement;
  let primaryColor = '';
  let backgroundColor = '';
  let pages: IPage[] = [];

  const unsubscribeNext = next.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      addPage(item.type, item.forecast);
    }
  });

  const unsubscribeCurrent = current.subscribe(async (item) => {
    if (!item) return;

    await tick();
    const lastPage = pages[pages.length - 1];
    console.log('pages', pages);
    console.log('pages last', lastPage);
    if (item.type !== ScheduleType.Headline) {
      addPage(item.type, item.forecast);
      gsap.fromTo(
        lastPage.container,
        { top: 912, left: 0 },
        { top: 0, left: 0, duration: 1 }
      );
    } else {
      // gsap.set(lastPage.container, { top: 912 });

      lastPage.component!.animateIn();
      gsap.fromTo(
        lastPage.container,
        { top: 912, left: 0 },
        { top: 0, left: 0, duration: 1 }
      );

      await sleep(1000);

      primaryColor = $current.portal.primaryColor;
      backgroundColor = $current.portal.backgroundColor;
    }

    if (item.type === ScheduleType.Text) {
      gsap.fromTo(
        bar,
        { width: 530 },
        { width: 1485, duration: item.duration, ease: 'none' }
      );
    }
  });

  const unsubscribePrevious = previous.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      const headline = pages.find(
        (item) => item.type === ScheduleType.Headline
      );
      if (!headline) return;

      gsap.fromTo(
        headline.container,
        { left: 0, top: 0 },
        { left: -1485, top: 0, duration: 0.75 }
      );
    }
  });

  function addPage(type: ScheduleType, forecast?: IForecastItem) {
    pages = [
      ...pages.slice(pages.length - 1),
      {
        container: null,
        component: null,
        type,
        forecast,
      },
    ];
  }

  async function onHeadlineLoad() {
    // const lastPage = pages[pages.length - 1];
    // lastPage.component!.animateIn();
    // gsap.fromTo(
    //   lastPage.container,
    //   { top: 912, left: 0 },
    //   { top: 0, left: 0, duration: 1 }
    // );
    // await sleep(1000);
    // primaryColor = $current.portal.primaryColor;
    // backgroundColor = $current.portal.backgroundColor;
  }

  onDestroy(() => {
    unsubscribeCurrent();
    unsubscribePrevious();
  });
</script>

<main
  style="--primary-color: {primaryColor}; --background-color: {backgroundColor};"
>
  <div class="container">
    <div class="bar" bind:this={bar} />
    <div class="bottom-container">
      <SideBar />
      <Article />
    </div>

    {#each pages as item, i (item)}
      <div
        class="overlay"
        class:visible={i === pages.length - 1}
        bind:this={item.container}
      >
        {#if item.type === ScheduleType.WeatherObservation}
          <WeatherMap />
        {:else if item.type === ScheduleType.WeatherForecast}
          <WeatherForecast />
        {:else if item.type === ScheduleType.WeatherForecastDay}
          <WeatherForecastDay item={item.forecast} />
        {:else if item.type === ScheduleType.Headline}
          <Headline on:load={onHeadlineLoad} bind:this={item.component} />
        {/if}
      </div>
    {/each}
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    position: relative;
    height: 912px;
    max-height: 912px;
  }

  .container div:first-child {
    display: flex;
    flex-direction: column;
  }

  .bar {
    background-color: var(--primary-color);
    height: 7px;
    width: 530px;
  }

  .bottom-container {
    display: flex;
  }

  .overlay {
    position: absolute;
    top: 912px;
  }

  .visible {
    top: 0;
  }
</style>
