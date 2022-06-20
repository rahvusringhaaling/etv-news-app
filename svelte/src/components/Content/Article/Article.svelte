<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { current, previous } from '../../../stores/current';
  import { ScheduleType } from '../../../domain/IScheduleItem';
  import Text from './Text.svelte';
  import PageIndicator from './PageIndicator.svelte';
  import type { IArticlePage } from '../../../domain/IArticlePage';

  const unsubscribe = current.subscribe(async (item) => {
    await tick();
    if (
      item &&
      $previous &&
      item.type === ScheduleType.Text &&
      $previous.type === ScheduleType.Headline
    ) {
      createPages();
      indicator.setActive(0, 0);
    }
  });

  let indicator: PageIndicator;
  const pageCount = 3;
  let pageIndex = 0;
  let pages: IArticlePage[] = [];

  function createPages() {
    pages = [];
    pageIndex = 0;
    indicator.setActive(pageIndex);
    addPage(0);
  }

  function addPage(index: number) {
    let articleNodes = null;
    if (index > 0) {
      articleNodes = pages[0].component!.getArticleNodes();
    }

    pages = [
      ...pages,
      {
        left: 955 * index,
        component: null,
        articleNodes
      }
    ];
  }

  async function handleKeydown(e: any) {
    if (e.key === 'ArrowRight') {
      addPage(1);
      await tick();
      pageIndex++;
      indicator.setActive(pageIndex);
      for (const item of pages) {
        item.component!.moveLeft(item.left, item.left - 955);
        item.left -= 955;
      }
    }
  }

  onDestroy(unsubscribe);
</script>

<svelte:window on:keydown={handleKeydown} />

<main>
  <div class="text-container">
    {#each pages as item (item)}
      {#if item.articleNodes === null}
        <Text bind:this={item.component} />
      {:else}
        <Text bind:this={item.component} articleNodes={item.articleNodes} />
      {/if}
    {/each}
  </div>
  <div class="indicator-container">
    <PageIndicator {pageCount} bind:this={indicator} />
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
