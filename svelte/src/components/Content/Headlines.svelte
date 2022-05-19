<script lang="ts">
  export let headlines: string[];

  const items = headlines.map((item) => ({
    text: item,
    active: false,
  }));

  export function setActive(index: number) {
    items[index].active = true;
  }
</script>

<main>
  <div class="container">
    <ul>
      {#each items as item, i}
        <li
          class:active={item.active}
          class:same={!item.active && !items[i + 1]?.active}
        >
          {item.text}
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  .container {
    background-color: #2e3192;
    width: 530px;
    height: 912px;
  }

  .active {
    background-color: #1d1d1d;
  }

  .same {
    padding-bottom: 0;
  }

  ul {
    display: flex;
    flex-direction: column;
  }

  li {
    padding: 40px 35px 40px 145px;
    color: #dddddd;
    font-family: "AvenirNextLTPro";
    font-size: 32px;
    white-space: normal;
  }
</style>
