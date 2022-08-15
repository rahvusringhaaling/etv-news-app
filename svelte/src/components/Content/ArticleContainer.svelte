<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { gsap } from 'gsap';
  import SideBar from './SideBar.svelte';
  import Headline from './Headline.svelte';
  import { sleep } from '../../utils';
  import { current, previous } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';
  import Article from './Article/Article.svelte';
  import WeatherMap from './Weather/WeatherMap/WeatherMap.svelte';
  import WeatherForecast from './Weather/WeatherForecast.svelte';
  import WeatherForecastDay from './Weather/WeatherForecastDay.svelte';
  import type { IForecastItem } from '../../domain/IForecastItem';

  interface IForecastViewItem {
    forecast: IForecastItem;
    component: HTMLElement | null;
  }

  let weatherMap: HTMLElement;
  let weatherForecast: HTMLElement;
  let bar: HTMLElement;
  let headline: HTMLElement;
  let primaryColor = '';
  let backgroundColor = '';
  let forecastPages: IForecastViewItem[] = [];

  const unsubscribeCurrent = current.subscribe(async (item) => {
    if (!item) return;
    if (item.index === 0) {
      forecastPages = [];
    }
    if (item.forecast) {
      forecastPages = [
        ...forecastPages.slice(forecastPages.length - 1),
        {
          forecast: item.forecast,
          component: null
        }
      ];
    }
    await sleep(0);

    switch (item.type) {
      case ScheduleType.WeatherObservation:
        gsap.fromTo(
          weatherMap,
          { bottom: -912, left: 0 },
          { bottom: 0, left: 0, duration: 1 }
        );
        break;
      case ScheduleType.WeatherForecast:
        gsap.fromTo(
          weatherForecast,
          { bottom: -912, left: 0 },
          { bottom: 0, left: 0, duration: 1 }
        );
        break;
      case ScheduleType.WeatherForecastDay:
        const element = forecastPages[forecastPages.length - 1].component;
        gsap.fromTo(
          element,
          { bottom: -912, left: 0 },
          { bottom: 0, left: 0, duration: 1 }
        );
        break;
      case ScheduleType.Headline:
        gsap.fromTo(
          headline,
          { bottom: -912, left: 0 },
          { bottom: 0, left: 0, duration: 1 }
        );
        break;
      case ScheduleType.Text:
        gsap.fromTo(
          bar,
          { width: 530 },
          { width: 1485, duration: item.duration, ease: 'none' }
        );
        break;
    }

    await sleep(1000);
    if (item.portal.name !== 'ilm') {
      gsap.set(weatherMap, { bottom: -912 });
      gsap.set(weatherForecast, { bottom: -912 });

      for (const item of forecastPages) {
        gsap.set(item.component, { bottom: -912 });
      }
    }

    primaryColor = item.portal.primaryColor;
    backgroundColor = item.portal.backgroundColor;
  });

  const unsubscribePrevious = previous.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      gsap.fromTo(
        headline,
        { left: 0, bottom: 0 },
        { left: -1485, bottom: 0, duration: 0.75 }
      );
    }
  });

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
    <div class="overlay weather" bind:this={weatherMap}>
      <WeatherMap />
    </div>
    <div class="overlay" bind:this={weatherForecast}>
      <WeatherForecast />
    </div>
    {#each forecastPages as item (item)}
      <div class="overlay" bind:this={item.component}>
        <WeatherForecastDay item={item.forecast} />
      </div>
    {/each}
    <div class="overlay" bind:this={headline}>
      <Headline />
    </div>
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
    bottom: -912px;
  }

  .weather {
    bottom: 0;
  }
</style>
