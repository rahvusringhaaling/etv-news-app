<script lang="ts">
  import CategoryList from "./Categories.svelte";
  import Weather from "./Weather.svelte";
</script>

<main>
  <div class="container">
    <CategoryList />
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
    background-color: #cbcbd5;
  }
</style>
