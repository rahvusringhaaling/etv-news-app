<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { current } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';
  import { sleep } from '../../utils';

  let lead = '';
  let body = '';

  onMount(async () => {});

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      await sleep(1000);
      lead = item.article.lead;
      body = item.article.body;
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div class="container">
    <p class="lead">{@html lead}</p>
    <p class="body">{@html body}</p>
  </div>
</main>

<style>
  .container {
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
</style>
