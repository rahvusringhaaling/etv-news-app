<script lang="ts">
  import QRCode from 'qrcode';
  import { onDestroy } from 'svelte';
  import { current } from '../../stores/current';

  let primaryColor = '';
  let canvas: HTMLCanvasElement;

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.article) {
      primaryColor = item.portal.primaryColor;

      const options = {
        margin: 0,
        width: 232,
        color: {
          dark: '#282828',
          light: '#00000000'
        }
      };

      QRCode.toCanvas(canvas, getShorterUrl(item.article.url), options);
    }
  });

  function getShorterUrl(fullUrl: string) {
    return fullUrl.split('/').slice(0, 4).join('/');
  }

  onDestroy(unsubscribe);
</script>

<main style="--primary-color: {primaryColor};">
  <div id="code-container">
    <p>Loe edasi:</p>
    <canvas bind:this={canvas} />
  </div>
</main>

<style>
  #code-container {
    display: flex;
    flex-direction: column;
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
