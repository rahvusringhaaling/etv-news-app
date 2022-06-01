<script lang="ts">
  import { onDestroy } from 'svelte';

  import { portals } from '../../stores/portals';

  let categories = [];
  let activeIndex = 0;

  const unsubscribe = portals.subscribe((value) => {
    categories = value.map((item, index) => ({
      text: item.name,
      active: activeIndex === index,
    }));
  });

  export function setActive(index: number) {
    activeIndex = index;
  }

  onDestroy(unsubscribe);
</script>

<main>
  <div class="container">
    <ul>
      {#each categories as item}
        <li class:active={item.active}>{item.text}</li>
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

  .active {
    color: var(--primary);
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: 70px;
    margin-top: 44px;
  }

  li {
    color: #1d1d1d;
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
  }
</style>
