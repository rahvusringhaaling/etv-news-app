<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { current } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';

  let primaryColor = '';
  let backgroundColor = '';
  let src = '';
  let text = '';

  onMount(async () => {});

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      console.log(item.article.header);
      src = item.article.imageURL;
      text = item.article.header;

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
    <img {src} alt="" />
    <div class="header">{text}</div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 1485px;
    height: 912px;
  }

  .header {
    display: flex;
    align-items: center;
    position: absolute;
    height: 200px;
    width: 100%;
    background-color: var(--primary-color);
    color: var(--text-color);
    bottom: 0;
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    padding: 20px;
    white-space: break-spaces;
  }
</style>
