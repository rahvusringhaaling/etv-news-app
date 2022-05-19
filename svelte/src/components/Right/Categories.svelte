<script lang="ts">
  const items = [
    "uudised",
    "kultuur",
    "sport",
    "meelelahutus",
    "teadus",
    "ilm",
  ].map((item) => ({
    text: item,
    active: false,
  }));

  items[2].active = true;
</script>

<main>
  <div class="container">
    <ul>
      {#each items as item}
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
    color: #2e3192;
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
    font-family: "AvenirNextLTPro";
    font-size: 40px;
  }
</style>
