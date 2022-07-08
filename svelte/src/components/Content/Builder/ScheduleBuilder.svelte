<script lang="ts">
  import { onMount } from 'svelte';
  import Text from '../Article/Text.svelte';
  import { IScheduleItem, ScheduleType } from '../../../domain/IScheduleItem';

  let pages: any[] = [];
  export let output: IScheduleItem[];
  export let input: any;
  const { portal, article } = input;

  onMount(() => {
    pages = [];
    addPage(true);
  });

  function addPage(isFirst: boolean) {
    let articleNodes = null;
    if (!isFirst) {
      articleNodes = pages[pages.length - 1].component!.getArticleNodes();
    }

    pages = [
      ...pages,
      {
        component: null,
        articleNodes
      }
    ];
  }

  async function handleEvent(event: any) {
    const { isLast } = event.detail;
    if (!isLast && pages.length < 4) {
      addPage(false);
    } else {
      output.push({
        portal: portal,
        type: ScheduleType.Headline,
        name: article.header,
        article: article,
        duration: 9,
        pageCount: pages.length
      });

      for (let i = 1; i <= pages.length; i++) {
        output.push({
          portal: portal,
          type: ScheduleType.Text,
          name: article.header,
          article: article,
          duration: 28,
          pageNumber: i,
          pageCount: pages.length,
          overflow: !isLast
        });
      }
    }
  }
</script>

<main>
  <div class="root-container">
    <div class="text-container">
      {#each pages as item (item)}
        {#if item.articleNodes === null}
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
            articleNodes={item.articleNodes}
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
    top: 1080;
    left: 0;
    visibility: hidden;
  }
</style>
