<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { current } from '../../../stores/current';
  import { ScheduleType } from '../../../domain/IScheduleItem';
  import Text from './Text.svelte';
  import PageIndicator from './PageIndicator.svelte';

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
    }
  });

  onMount(() => {
    document.addEventListener('keydown', (e: any) => {
      if (e.key === 'ArrowRight') {
        console.log('keydown', e.key, e.code);
      }
    });
  });

  onDestroy(unsubscribe);
</script>

<main>
  <Text />
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
</style>
