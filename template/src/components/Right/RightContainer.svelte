<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { Language } from '../../types/Language';
  import { language } from '../../stores/language';
  import { current } from '../../stores/current';
  import CategoryList from './CategoryList.svelte';
  import QrCode from './QrCode.svelte';
  import Weather from './Weather.svelte';
  import { observations } from '../../stores/weather';
  import type { IObservationItem } from '../../types/IObservationItem';
  import { ScheduleType } from '../../types/IScheduleItem';

  enum ComponentType {
    QrCode,
    Weather,
  }

  interface IPage {
    left: number;
    component: any;
    url?: string;
    text?: any;
    primaryColor: string;
    observation: IObservationItem;
    type: ComponentType;
  }

  let container: HTMLDivElement;
  let pages: IPage[] = [];
  let interval: NodeJS.Timeout;
  let observationIndex = 0;
  let filtered: IObservationItem[] = [];

  let lastText = '';
  let lastName = '';
  let lastItemIndex = 0;

  const unsubscribeCurrent = current.subscribe(async (item) => {
    if (item) {
      if (item.index < lastItemIndex) {
        lastItemIndex = item.index;
        return;
      }

      gsap.to(container, {
        backgroundColor: item.portal.backgroundColor,
        duration: 0.2,
        delay: 1.1,
      });

      let url = item.article?.url;
      let type = ComponentType.Weather;
      let text = '';
      lastItemIndex = item.index;

      if (item.portal.portal === 'ilm') {
        url = 'ilm.err.ee';
        type = ComponentType.QrCode;
        text = url;
      } else if (item.article?.hasAudio) {
        type = ComponentType.QrCode;
        text = $language === Language.Estonian ? 'Kuula klippi:' : 'Аудиоклип:';
      } else if (item.article?.hasGallery) {
        type = ComponentType.QrCode;
        text =
          $language === Language.Estonian ? 'Vaata galeriid:' : 'Фотогалерея:';
      } else if (item.article?.hasVideo) {
        type = ComponentType.QrCode;
        text =
          $language === Language.Estonian ? 'Vaata videot:' : 'Смотрите видео:';
      } else if (item.overflow && item.pageCount === item.pageNumber) {
        type = ComponentType.QrCode;
        text = $language === Language.Estonian ? 'Loe edasi:' : 'Подробнее:';
      }
      if (
        (text.length > 0 && text === lastText && item.name === lastName) ||
        (item.portal.portal === 'ilm' && text === lastText)
      ) {
        return;
      }
      lastText = text;
      lastName = item.name;

      if (pages.length === 0) {
        addPage(true, type, item.portal.primaryColor, url, text);
      } else {
        addPage(false, type, item.portal.primaryColor, url, text);
        await tick();
        movePages();
      }

      clearInterval(interval);
      if (type === ComponentType.QrCode || item.type !== ScheduleType.Text) {
        return;
      }

      interval = setInterval(async () => {
        addPage(
          false,
          ComponentType.Weather,
          item.portal.primaryColor,
          item.article?.url
        );
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

  async function addPage(
    isFirst: boolean,
    type: ComponentType,
    primaryColor: string,
    url?: string,
    text?: string
  ) {
    observationIndex = (observationIndex + 1) % filtered.length;

    pages = [
      ...pages.slice(pages.length - 1),
      {
        left: 435 * (isFirst ? 0 : 1),
        component: null,
        url,
        text,
        primaryColor,
        observation: filtered[observationIndex],
        type,
      },
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
    <div>
      <CategoryList />
    </div>
    <div class="bottom-container">
      {#each pages as item (item)}
        {#if item.type === ComponentType.QrCode}
          <QrCode
            bind:this={item.component}
            url={item.url}
            text={item.text}
            primaryColor={item.primaryColor}
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
    width: 435px;
    height: 912px;
  }

  .container > div:first-child {
    margin-bottom: 8px;
  }

  .bottom-container {
    display: flex;
    width: 435px;
    height: 479px;
    background-color: #dddddd;
  }
</style>
