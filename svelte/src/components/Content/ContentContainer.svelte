<script lang="ts">
  import { onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import HeadlineList from './HeadlineList.svelte';
  import Headline from './Headline.svelte';
  import { sleep } from '../../utils';
  import { current } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';
  import Article from './Article.svelte';

  let bar: HTMLElement;
  let headline: HTMLElement;
  let primaryColor = '';
  let backgroundColor = '';

  const unsubscribe = current.subscribe(async (item) => {
    if (item) {
      if (item.type === ScheduleType.Headline) {
        gsap.fromTo(
          headline,
          { bottom: -912, left: 0 },
          { bottom: 0, left: 0, duration: 1 }
        );
      } else if (item.type === ScheduleType.Text) {
        gsap.fromTo(headline, { left: 0 }, { left: -1485, duration: 0.75 });
        gsap.fromTo(
          bar,
          { width: 530 },
          { width: 1485, duration: item.duration, ease: 'none' }
        );
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
    <div class="bar" bind:this={bar} />
    <div class="bottom-container">
      <HeadlineList />
      <Article />
    </div>
    <div class="headline" bind:this={headline}>
      <Headline />
    </div>
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

  .headline {
    position: absolute;
    bottom: -912px;
  }
</style>
