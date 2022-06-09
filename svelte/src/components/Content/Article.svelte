<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { current } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';
  import { sleep } from '../../utils';

  let lead = '';
  let body = '';
  let bodyContainer: HTMLElement;
  const maxHeight = 950;

  onMount(async () => {});

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      await sleep(1100);
      lead = item.article.lead;
      body = item.article.body;
      await sleep(0);
      const children = bodyContainer.children;

      for (const element of [...children].reverse()) {
        const { y } = element.getBoundingClientRect();
        if (y > maxHeight) {
          element.remove();
        }
      }

      const last = children[children.length - 1];
      if (last.firstChild.nodeType === Node.TEXT_NODE) {
        const words = last.firstChild.textContent.split(' ');
        console.log(words);

        for (let i = words.length; i >= 0; i--) {
          const { y, height } = last.getBoundingClientRect();
          if (y + height <= maxHeight) {
            break;
          }
          last.firstChild.textContent = words.slice(0, i).join(' ');
        }
      }
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div class="text-container">
    <p class="lead">{@html lead}</p>
    <p class="body" bind:this={bodyContainer}>{@html body}</p>
  </div>
  <div class="circle-container">
    <div class="circle active" />
    <div class="circle" />
    <div class="circle" />
  </div>
</main>

<style>
  .text-container {
    width: 955px;
    height: 905px;
    color: #282828;
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    padding: 40px 40px 0 95px;
  }

  .lead :global(p) {
    font-weight: 600;
    padding-bottom: 10px;
  }

  .body :global(*),
  .lead :global(*) {
    white-space: break-spaces;
  }

  .circle-container {
    display: flex;
    justify-content: center;
    width: 955px;
    position: absolute;
    bottom: 50px;
    gap: 20px;
  }

  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #aaaaaa;
  }

  .active {
    background-color: #373737;
  }
</style>
