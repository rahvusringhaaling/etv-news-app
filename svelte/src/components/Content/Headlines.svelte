<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { IArticle } from '../../domain/IArticle';
  import { feed } from '../../stores/feed';

  let activeIndex = 0;
  let lastFeedIndex = 0;
  let items = [];
  let height: number = 0;

  $: if (height > 830) {
    items = items.slice(0, -1);
  }

  function setItems(newItems: IArticle[]) {
    items = newItems.map((article, index) => ({
      text: article.header,
      active: activeIndex === index,
    }));
  }

  const unsubscribe = feed.subscribe((value) => {
    if (!value['uudised']) return;
    setItems(value['uudised']);
  });

  export function setActive(index: number) {
    if (Object.keys($feed).length === 0) {
      activeIndex = index;
      lastFeedIndex = index;
      return;
    }

    const newItems = $feed['uudised'];
    const includesLastItem = items
      .map((x) => x.text)
      .includes(newItems[newItems.length - 1].header);
    if (includesLastItem) {
      activeIndex++;
      setItems(newItems.slice(lastFeedIndex - 1));
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
  <div class="container">
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
    background-color: var(--primary);
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
    color: var(--text);
    font-family: 'AvenirNextLTPro';
    font-size: 32px;
    white-space: normal;
  }
</style>
