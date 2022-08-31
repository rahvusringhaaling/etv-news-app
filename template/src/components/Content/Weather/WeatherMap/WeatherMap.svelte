<script lang="ts">
  import { Language } from '../../../../types/Language';
  import { language } from '../../../../stores/language';
  import { onDestroy } from 'svelte';
  import type { IFilteredObservationItem } from '../../../../types/IFilteredObservationItem';
  import { observationsMap } from '../../../../stores/weather';
  import Svg from './Svg.svelte';

  let time = '';
  let items: IFilteredObservationItem[] = [];

  const unsubscribe = observationsMap.subscribe((data) => {
    if (!data) return;
    if (data.timestamp) {
      const date = new Date(data.timestamp * 1000);
      const prefix =
        $language === Language.Estonian ? 'Ilm kell' : 'Погода сейчас';
      time = `${prefix} ${date.getHours()}:00`;
    }

    data.observations.forEach((item) => {
      if (item.icon) {
        item.x -= 55;
        item.y -= 55;
      }
    });
    items = data.observations;
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div id="map-container">
    <div id="svg">
      <Svg />
    </div>
    <div id="time-text">{time}</div>
    <div id="url-text">ILMATEENISTUS.EE</div>
    {#each items as { x, y, airTemperature, icon }}
      <div class="location" style:left="{x}px" style:top="{y}px">
        {#if icon}
          <img src="/icons/black/{icon}.png" alt="" />
        {/if}
        <span>{airTemperature?.toLocaleString('et-ET')}°C</span>
      </div>
    {/each}
  </div>
</main>

<style>
  #map-container {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 1485px;
    height: 912px;
    background-color: #29abe2;
    color: #edeeee;
  }

  #svg {
    width: 87%;
  }

  #time-text {
    position: absolute;
    top: 60px;
    left: 147px;
    font-size: 40px;
  }

  #url-text {
    position: absolute;
    bottom: 100px;
    left: 147px;
    font-size: 28px;
  }

  .location {
    position: absolute;
    display: flex;
    align-items: center;
    font-size: 38px;
    font-weight: bold;
    color: #282828;
  }
</style>
