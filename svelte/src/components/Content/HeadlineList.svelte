<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { IArticle } from '../../domain/IArticle';
  import { ScheduleType } from '../../domain/IScheduleItem';
  import { current } from '../../stores/current';
  import { feed } from '../../stores/feed';
  import { sleep } from '../../utils';

  let activeIndex = 0;
  let lastFeedIndex = 0;
  let items = [];
  let height: number = 0;
  let primaryColor = '';
  let textColor = '';
  let lastPortal;

  $: if (height > 830) {
    items = items.slice(0, -1);
  }

  function setItems(newItems: IArticle[]) {
    items = newItems.map((article, index) => ({
      text: article.header,
      active: activeIndex === index
    }));
  }

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      await sleep(1000);
      if (item.portal !== lastPortal) {
        activeIndex = 0;
        lastFeedIndex = 0;
        items = [];
      }
      lastPortal = item.portal;

      const index = items.length === 0 ? 0 : lastFeedIndex + 1;

      setActive(index);
      primaryColor = item.portal.primaryColor;
      textColor = item.portal.textColor;
    }
  });

  function setActive(index: number) {
    const newItems = $feed[$current.portal.portal];

    if (index === 0) {
      setItems(newItems);
      return;
    }

    const includesFirstItem = items
      .map((x) => x.text)
      .includes(newItems[0].header);
    const includesLastItem = items
      .map((x) => x.text)
      .includes(newItems[newItems.length - 1].header);

    if (includesLastItem) {
      activeIndex++;
      if (includesFirstItem) {
        setItems(newItems);
        lastFeedIndex = index;
      } else {
        setItems(newItems.slice(lastFeedIndex - 1));
      }
      return;
    }

    const sliced = newItems.slice(index - 1);
    activeIndex = 1;
    lastFeedIndex = index;
    setItems(sliced);
  }

  onDestroy(unsubscribe);
</script>

<main>
  <div
    class="container"
    style="--primary-color: {primaryColor}; --text-color: {textColor};"
  >
    <ul bind:clientHeight={height}>
      {#each items as item, i}
        <li
          class:active={item.active}
          class:neighbor={!item.active && !items[i + 1]?.active}
        >
          {item.text}
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  .container {
    background-color: var(--primary-color);
    width: 530px;
    height: 100%;
  }

  .active {
    background-color: #1d1d1d;
    color: #eeeeee;
  }

  .neighbor {
    padding-bottom: 0;
  }

  ul {
    display: flex;
    flex-direction: column;
  }

  li {
    padding: 40px 35px 40px 145px;
    color: var(--text-color);
    font-family: 'AvenirNextLTPro';
    font-size: 32px;
    white-space: normal;
  }
</style>
