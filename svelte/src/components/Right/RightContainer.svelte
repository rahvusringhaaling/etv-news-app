<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../stores/current';
  import CategoryList from './CategoryList.svelte';
  import QrCode from './QrCode.svelte';
  import Weather from './Weather.svelte';

  let container: HTMLDivElement;
  let pages: any[] = [];

  const unsubscribe = current.subscribe(async (item) => {
    if (item) {
      gsap.to(container, {
        backgroundColor: item.portal.backgroundColor,
        duration: 0.2,
        delay: 1.1
      });

      addPage(true, item.portal.primaryColor, item.article?.url);

      let i = 0;
      const x = setInterval(async () => {
        addPage(false, item.portal.primaryColor, item.article?.url);
        await tick();

        for (const item of pages) {
          item.component!.moveLeft(item.left, item.left - 435);
          item.left -= 435;
        }

        i++;
        if (i === 3) {
          clearInterval(x);
        }
      }, 1500);
    }
  });

  async function addPage(isFirst: boolean, primaryColor: string, url?: string) {
    pages = [
      ...pages,
      {
        left: 435 * (isFirst ? 0 : 1),
        component: null,
        primaryColor,
        url
      }
    ];
  }

  onDestroy(unsubscribe);
</script>

<main>
  <div class="container" bind:this={container}>
    <CategoryList />
    <div class="bottom-container">
      {#each pages as item (item)}
        <!-- <QrCode
          bind:this={item.component}
          primaryColor={item.primaryColor}
          url={item.url}
        /> -->
        <Weather bind:this={item.component} />
      {/each}
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 8px;
    width: 435px;
    height: 912px;
  }

  .bottom-container {
    display: flex;
    width: 435px;
    height: 479px;
    background-color: #dddddd;
  }
</style>
