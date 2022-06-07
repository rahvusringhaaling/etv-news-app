<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { gsap } from 'gsap';
  import HeadlineList from './HeadlineList.svelte';
  import Headline from './Headline.svelte';
  import { sleep } from '../../utils';
  import { current } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';

  let bar: HTMLElement;
  let headline: HTMLElement;
  let primaryColor = '';
  let backgroundColor = '';
  let showHeadline = true;

  onMount(async () => {
    gsap.fromTo(
      bar,
      { width: 530 },
      { width: 1485, duration: 12, ease: 'none' }
    );
  });

  const unsubscribe = current.subscribe(async (item) => {
    if (item) {
      showHeadline = item.type === ScheduleType.Headline;
      if (showHeadline) {
        gsap.fromTo(
          headline,
          { bottom: -912 },
          { bottom: 0, duration: 0.75, delay: 0.25 }
        );
      } else {
        gsap.fromTo(headline, { bottom: 0 }, { bottom: -912, duration: 0.75 });
      }
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
    <!-- <div class:hidden={showHeadline}> -->
    <div class="bar" bind:this={bar} />
    <div class="bottom-container">
      <HeadlineList />
      <div class="article" />
    </div>
    <!-- </div> -->
    <!-- <div class:hidden={!showHeadline}> -->
    <div class="headline" bind:this={headline}>
      <Headline />
    </div>
    <!-- </div> -->
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    background-color: var(--background-color);
    position: relative;
    height: 912px;
    max-height: 912px;
  }

  .container div:first-child {
    display: flex;
    flex-direction: column;
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

  .hidden {
    display: none !important;
  }

  .headline {
    position: absolute;
    bottom: -912px;
  }
</style>
