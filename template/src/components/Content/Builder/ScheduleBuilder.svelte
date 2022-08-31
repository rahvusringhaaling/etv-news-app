<script lang="ts">
  import { onMount } from 'svelte';
  import Text from '../Article/Text.svelte';
  import {
    ScheduleType,
    type IScheduleItem,
  } from '../../../types/IScheduleItem';
  import type { IArticleNodes } from 'src/types/IArticleNodes';
  import type { IArticlePortalWrapper } from 'src/types/IArticlePortalWrapper';

  interface IPage {
    component: any;
    leadArticleNodes?: IArticleNodes;
    bodyArticleNodes?: IArticleNodes;
  }

  let pages: IPage[] = [];
  export let output: IScheduleItem[];
  export let input: IArticlePortalWrapper;
  const { portal, article } = input;
  let x;

  onMount(() => {
    pages = [];
    addPage(true);
  });

  function addPage(isFirst: boolean) {
    let leadArticleNodes = null;
    let bodyArticleNodes = null;
    if (!isFirst) {
      leadArticleNodes =
        pages[pages.length - 1].component!.getLeadArticleNodes();
      bodyArticleNodes =
        pages[pages.length - 1].component!.getBodyArticleNodes();
    }

    pages = [
      ...pages,
      {
        component: null,
        leadArticleNodes,
        bodyArticleNodes,
      },
    ];
  }

  async function handleEvent(event: any) {
    const { isLast, isTooLong } = event.detail;
    if (isTooLong) return;

    if (!isLast && pages.length < 3) {
      addPage(false);
    } else {
      output.push({
        index: 0,
        portal: portal,
        type: ScheduleType.Headline,
        name: article.header,
        article: article,
        duration: 9,
        pageCount: pages.length,
      });

      for (let i = 1; i <= pages.length; i++) {
        output.push({
          index: 0,
          portal: portal,
          type: ScheduleType.Text,
          name: article.header,
          article: article,
          duration: 28,
          pageNumber: i,
          pageCount: pages.length,
          overflow: !isLast,
        });
      }
    }
  }
</script>

<main>
  <div class="root-container">
    <div class="text-container">
      {#each pages as item (item)}
        {#if item.bodyArticleNodes === null || item.leadArticleNodes === null}
          <Text
            bind:this={item.component}
            {article}
            on:textrender={handleEvent}
          />
        {:else}
          <Text
            bind:this={item.component}
            {article}
            on:textrender={handleEvent}
            leadArticleNodes={item.leadArticleNodes}
            bodyArticleNodes={item.bodyArticleNodes}
          />
        {/if}
      {/each}
    </div>
  </div>
</main>

<style>
  .text-container {
    position: relative;
    width: 955px;
    height: 905px;
  }

  .root-container {
    position: absolute;
    top: 174px;
    left: 0;
    visibility: hidden;
  }
</style>
