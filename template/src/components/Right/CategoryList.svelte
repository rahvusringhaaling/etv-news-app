<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../stores/current';
  import { portals } from '../../stores/portals';
  import { get } from 'svelte/store';
  import type { ICategoryItem } from '../../domain/ICategoryItem';

  let categories: ICategoryItem[] = [];
  let activeIndex = 0;

  const unsubscribe = current.subscribe(async (item) => {
    if (item) {
      activeIndex = get(portals).find(
        (x) => x.name === item.portal.name
      )!.index;
      categories = get(portals).map((item, index) => ({
        text: item.name,
        active: activeIndex === index,
      }));

      await tick();
      gsap.to('.categories-inactive', {
        color: '#1d1d1d',
        duration: 0.25,
      });

      gsap.to('.categories-active', {
        color: item.portal.primaryColor,
        duration: 0.25,
      });
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div class="container">
    <ul class="categories-list">
      {#each categories as item}
        <li class={item.active ? 'categories-active' : 'categories-inactive'}>
          {item.text}
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  .container {
    width: 435px;
    height: 425px;
    background-color: #dddddd;
  }

  ul {
    display: flex;
    flex-direction: column;
    margin-left: 70px;
    margin-top: 44px;
  }

  li {
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    margin-bottom: 8px;
  }
</style>
