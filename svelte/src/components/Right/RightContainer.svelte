<script lang="ts">
  import { onMount } from 'svelte';

  import Categories from './Categories.svelte';
  import Weather from './Weather.svelte';

  let child: Categories;

  onMount(() => {
    child.setActive(0);
  });
</script>

<main>
  <div class="container">
    <Categories bind:this={child} />
    <Weather />
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 435px;
    height: 912px;
    background-color: var(--background);
  }
</style>
