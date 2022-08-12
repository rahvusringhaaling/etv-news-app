<script lang="ts">
  import { onMount } from 'svelte';
  import type { IObservationItem } from '../../domain/IObservationItem';
  import { gsap } from 'gsap';

  export let observation: IObservationItem;
  let name = '';
  let temperature = 0;
  let icon = 'paike';
  let container: HTMLElement;

  onMount(() => {
    if (observation && observation.icon && observation.airTemperature) {
      name = observation.name;
      temperature = observation.airTemperature;
      icon = observation.icon;
    }
  });

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
</script>

<main>
  <div id="container" bind:this={container}>
    {#if name.length > 0}
      <p>{name}</p>
      <div>
        <img src="/assets/icons/{icon}.png" alt="" />
        <p>{temperature.toLocaleString('et-ET')}°C</p>
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
