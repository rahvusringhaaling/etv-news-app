<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../stores/current';
  import CategoryList from './CategoryList.svelte';
  import QrCode from './QrCode.svelte';
  import Weather from './Weather.svelte';
  import { observations } from '../../stores/weather';
  import type { IObservationItem } from '../../domain/IObservationItem';

  let container: HTMLDivElement;
  let pages: any[] = [];
  let interval: NodeJS.Timeout;
  let observationIndex = 0;
  let filtered: IObservationItem[] = [];

  enum ComponentType {
    QrCode,
    Weather
  }

  const unsubscribeCurrent = current.subscribe(async (item) => {
    if (item) {
      console.log('current', item);
      gsap.to(container, {
        backgroundColor: item.portal.backgroundColor,
        duration: 0.2,
        delay: 1.1
      });

      if (pages.length === 0) {
        addPage(true, item.portal.primaryColor, item.article?.url);
      } else {
        addPage(false, item.portal.primaryColor, item.article?.url);
        await tick();
        movePages();
      }

      clearInterval(interval);
      interval = setInterval(async () => {
        addPage(false, item.portal.primaryColor, item.article?.url);
        await tick();
        movePages();
      }, 7000);
    }
  });

  const unsubscribeObservations = observations.subscribe(
    (observations: IObservationItem[]) => {
      if (observations.length === 0) return;
      filtered = observations.filter((item) => item.icon);
    }
  );

  async function addPage(isFirst: boolean, primaryColor: string, url?: string) {
    observationIndex = (observationIndex + 1) % filtered.length;

    pages = [
      ...pages.slice(pages.length - 1),
      {
        left: 435 * (isFirst ? 0 : 1),
        component: null,
        primaryColor,
        url,
        observation: filtered[observationIndex],
        type: ComponentType.Weather
      }
    ];
  }

  function movePages() {
    for (const item of pages) {
      item.component!.moveLeft(item.left, item.left - 435);
      item.left -= 435;
    }
  }

  onDestroy(() => {
    unsubscribeCurrent();
    unsubscribeObservations();
  });
</script>

<main>
  <div class="container" bind:this={container}>
    <CategoryList />
    <div class="bottom-container">
      {#each pages as item (item)}
        {#if item.type === ComponentType.QrCode}
          <QrCode
            bind:this={item.component}
            primaryColor={item.primaryColor}
            url={item.url}
          />
        {:else if item.type === ComponentType.Weather}
          <Weather bind:this={item.component} observation={item.observation} />
        {/if}
      {/each}
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 8px;
    width: 435px;
    height: 912px;
  }

  .bottom-container {
    display: flex;
    width: 435px;
    height: 479px;
    background-color: #dddddd;
  }
</style>
