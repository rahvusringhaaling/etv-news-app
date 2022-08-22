<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { current, previous } from '../../../stores/current';
  import { ScheduleType } from '../../../domain/IScheduleItem';
  import Text from './Text.svelte';
  import PageIndicator from './PageIndicator.svelte';
  import type { IArticlePage } from '../../../domain/IArticlePage';

  let indicator: PageIndicator;
  let pageCount = 1;
  let pages: IArticlePage[] = [];

  const unsubscribeCurrent = current.subscribe(async (item) => {
    if (item?.type === ScheduleType.Text && item.pageNumber! > 1) {
      const showMore = item.pageNumber === item.pageCount && item.overflow!;
      addPage(false, showMore, item.portal.primaryColor);
      await tick();
      indicator.setActive(item.pageNumber! - 1);
      for (const item of pages) {
        item.component!.moveLeft(item.left, item.left - 955);
        item.left -= 955;
      }
    }
  });

  const unsubscribePrevious = previous.subscribe(async (item) => {
    if (item?.type === ScheduleType.Headline) {
      pages = [];
      addPage(true);
      pageCount = item.pageCount!;
      indicator.setActive(0, 0);
    }
  });

  function addPage(
    isFirst: boolean,
    showMore: boolean = false,
    primaryColor = ''
  ) {
    let leadArticleNodes = null;
    let bodyArticleNodes = null;
    if (!isFirst) {
      leadArticleNodes =
        pages[pages.length - 1].component!.getLeadArticleNodes();
      bodyArticleNodes =
        pages[pages.length - 1].component!.getBodyArticleNodes();
    }

    pages = [
      ...pages.slice(pages.length - 1),
      {
        left: 955 * (isFirst ? 0 : 1),
        component: null,
        leadArticleNodes,
        bodyArticleNodes,
        showMore,
        primaryColor,
      },
    ];
  }

  onDestroy(() => {
    unsubscribeCurrent();
    unsubscribePrevious();
  });
</script>

<main>
  <div class="text-container">
    {#each pages as item (item)}
      {#if item.bodyArticleNodes === null || item.leadArticleNodes === null}
        <Text
          bind:this={item.component}
          article={$current.article}
          showMore={item.showMore}
          primaryColor={item.primaryColor}
        />
      {:else}
        <Text
          bind:this={item.component}
          article={$current.article}
          leadArticleNodes={item.leadArticleNodes}
          bodyArticleNodes={item.bodyArticleNodes}
          showMore={item.showMore}
          primaryColor={item.primaryColor}
        />
      {/if}
    {/each}
  </div>
  <div class="indicator-container">
    <PageIndicator bind:pageCount bind:this={indicator} />
  </div>
</main>

<style>
  .indicator-container {
    display: flex;
    justify-content: center;
    width: 955px;
    position: absolute;
    bottom: 50px;
  }

  .text-container {
    position: relative;
    width: 955px;
    height: 905px;
  }
</style>
