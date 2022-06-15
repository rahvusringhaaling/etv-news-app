<script lang="ts">
  import { onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../../stores/current';
  import { ScheduleType } from '../../../domain/IScheduleItem';
  import Text from './Text.svelte';
  import PageIndicator from './PageIndicator.svelte';

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
    }
  });

  let list: any[] = [
    {
      left: 0,
      component: Text
    },
    {
      left: 955,
      component: Text
    }
  ];

  function handleKeydown(e: any) {
    if (e.key === 'ArrowRight') {
      for (const item of list) {
        console.log(item.component);

        item.component.moveLeft(0, -955);
      }
    }
  }

  onDestroy(unsubscribe);
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
  <div class="text-container">
    {#each list as item (item)}
      <svelte:component this={item.component} />
    {/each}
  </div>
  <div class="indicator-container">
    <PageIndicator totalPages={4} />
  </div>
</main>

<style>
  .indicator-container {
    display: flex;
    justify-content: center;
    width: 955px;
    position: absolute;
    bottom: 50px;
    gap: 20px;
  }

  .text-container {
    position: relative;
    width: 955px;
    height: 905px;
  }
</style>
