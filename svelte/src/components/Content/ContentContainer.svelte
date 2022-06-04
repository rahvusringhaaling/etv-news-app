<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { gsap } from 'gsap';
  import Headlines from './Headlines.svelte';
  import { sleep } from '../../utils';
  import { current } from '../../stores/current';

  let bar: HTMLElement;
  let primaryColor = '';
  let backgroundColor = '';

  onMount(async () => {
    gsap.fromTo(
      bar,
      { width: 530 },
      { width: 1485, duration: 12, ease: 'none' }
    );
  });

  const unsubscribe = current.subscribe(async (item) => {
    if (item) {
      await sleep(1000);
      primaryColor = item.portal.primaryColor;
      backgroundColor = item.portal.backgroundColor;
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div
    class="container"
    style="--primary-color: {primaryColor}; --background-color: {backgroundColor};"
  >
    <div class="bar" bind:this={bar} />
    <div class="bottom-container">
      <Headlines />
      <div class="article" />
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
  }

  .bar {
    background-color: var(--primary-color);
    height: 7px;
    width: 530px;
  }

  .bottom-container {
    display: flex;
  }

  .article {
    width: 955px;
    height: 905px;
  }
</style>
