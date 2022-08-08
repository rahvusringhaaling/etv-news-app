<script lang="ts">
  import QRCode from 'qrcode';
  import { gsap } from 'gsap';
  import { onMount } from 'svelte';

  export let url: string | undefined;
  export let text: string;
  export let primaryColor: string;
  let canvas: HTMLCanvasElement;
  let container: HTMLElement;

  onMount(() => {
    if (!url) return;

    const options = {
      margin: 0,
      width: 232,
      color: {
        dark: '#282828',
        light: '#00000000'
      }
    };

    QRCode.toCanvas(canvas, getShorterUrl(url), options);
  });

  function getShorterUrl(fullUrl: string) {
    return fullUrl.split('/').slice(0, 4).join('/');
  }

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

<main style="--primary-color: {primaryColor};">
  <div id="container" bind:this={container}>
    <p>{text}</p>
    <canvas bind:this={canvas} />
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
    background-color: #dddddd;
    padding-left: 70px;
    padding-top: 45px;
  }

  p {
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    color: var(--primary-color);
  }

  canvas {
    width: 232px;
    height: 232px;
  }
</style>
