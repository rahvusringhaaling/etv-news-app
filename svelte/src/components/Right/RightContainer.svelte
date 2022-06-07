<script lang="ts">
  import { onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../stores/current';
  import CategoryList from './CategoryList.svelte';
  import Weather from './Weather.svelte';

  let container: HTMLDivElement;

  const unsubscribe = current.subscribe(async (item) => {
    if (item) {
      gsap.to(container, {
        backgroundColor: item.portal.backgroundColor,
        duration: 0.2,
        delay: 1.5
      });
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div class="container" bind:this={container}>
    <CategoryList />
    <Weather />
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 435px;
    height: 912px;
  }
</style>
