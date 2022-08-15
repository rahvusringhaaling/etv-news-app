<script lang="ts">
  import { forecast } from '../../../stores/weather';
  import { getWeekDay } from '../../../utils';
</script>

<main>
  <div id="root-container">
    <div>
      <div id="left">
        <div class="bg" />
      </div>
      <div id="grid">
        {#each $forecast as { date }}
          <div class="header primary ">
            {getWeekDay(new Date(date))}
          </div>
        {/each}

        {#each $forecast as item}
          <div class="row bg">
            <img src="/assets/icons/white/{item.night.icon}.png" alt="" />
            <span>
              {item.night.tempMin}..{item.night.tempMax}°C
            </span>
          </div>
        {/each}

        {#each $forecast as item}
          <div class="row">
            <img src="/assets/icons/black/{item.day.icon}.png" alt="" />
            <span class="primary">
              {item.day.tempMin}..{item.day.tempMax}°C
            </span>
          </div>
        {/each}
      </div>
      <div id="right">
        <div class="bg" />
      </div>
    </div>
  </div>
</main>

<style>
  #root-container {
    background-color: #dddddd;
  }

  #root-container > div {
    width: 1485px;
    height: 912px;
    display: flex;
    font-family: 'AvenirNextLTPro';
    background-color: #dae7ec;
    color: #282828;
  }

  #grid {
    position: relative;
    grid-template-columns: repeat(4, 300px);
    justify-items: center;
    justify-content: center;

    color: #edeeee;
  }

  #left,
  #right {
    flex-grow: 1;
  }

  #left > div,
  #right > div {
    grid-row: 2 / 3;
  }

  #left,
  #grid,
  #right {
    display: grid;
    grid-template-rows: 176px repeat(2, 295px);
  }

  .header {
    align-self: center;
    font-size: 46px;
  }

  .row {
    display: flex;
    flex-direction: column;
    gap: 17px;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 37px;
    font-weight: bold;
  }

  .bg {
    background-color: #1e1e1e;
  }

  .primary {
    color: var(--primary-color);
  }
</style>
