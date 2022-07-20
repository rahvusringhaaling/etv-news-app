<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { IObservationItem } from '../../domain/IObservationItem';
  import { observations } from '../../stores/weather';
  import { gsap } from 'gsap';

  let name = '';
  let temperature = 0;
  let icon = 'paike';
  let container: HTMLElement;

  const unsubscribe = observations.subscribe(
    (observations: IObservationItem[]) => {
      if (observations.length === 0) return;

      const item = observations.filter((item) => item.icon)[0];
      if (item && item.icon) {
        name = item.name;
        temperature = item.airTemperature;
        icon = item.icon;
      }
    }
  );

  export function moveLeft(from: number, to: number) {
    gsap.fromTo(
      container,
      {
        left: from
      },
      {
        left: to,
        duration: 0.75
      }
    );
  }

  onDestroy(unsubscribe);
</script>

<main>
  <div id="container" bind:this={container}>
    {#if name.length > 0}
      <p>{name}</p>
      <div>
        <img src="/assets/icons/{icon}.png" alt="" />
        <p>{temperature}°C</p>
      </div>
    {/if}
  </div>
</main>

<style>
  #container {
    display: flex;
    flex-direction: column;
    position: absolute;
    gap: 40px;
    width: 435px;
    height: 479px;
    padding-left: 70px;
    padding-top: 45px;
  }

  #container > div {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  #container > div > p {
    padding-left: 8px;
    font-weight: bold;
  }

  p {
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    color: #1d1d1d;
  }

  img {
    width: 150px;
    height: 150px;
  }
</style>
