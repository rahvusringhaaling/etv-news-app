<script lang="ts">
  import { current } from '../../../stores/current';
  import { language } from '../../../stores/language';
  import type { IForecastItem } from '../../../types/IForecastItem';
  import { getWeekDay } from '../../../utils';

  export let item: IForecastItem | undefined;
  let primaryColor = $current.portal.primaryColor;
  let backgroundColor = $current.portal.backgroundColor;
</script>

<main
  style="--primary-color: {primaryColor}; --background-color: {backgroundColor};"
>
  <div id="root-container">
    <div>
      <div id="grid">
        {#if item}
          <div class="header primary left">
            {getWeekDay(new Date(item.date), $language)}
          </div>

          <div class="row bg">
            <span class="left">
              {@html item?.night.text}
            </span>
          </div>

          <div class="row bg">
            <img src="/icons/white/{item.night.icon}.png" alt="" />
            <span class="bold">
              {item.night.tempMin}..{item.night.tempMax}°C
            </span>
          </div>

          <div class="row">
            <span class="left secondary">
              {@html item?.day.text}
            </span>
          </div>

          <div class="row">
            <img src="/icons/black/{item.day.icon}.png" alt="" />
            <span class="primary bold">
              {item.day.tempMin}..{item.day.tempMax}°C
            </span>
          </div>
        {/if}
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
    background-color: #dae7ec;
    color: #282828;
  }

  #grid {
    display: grid;
    grid-template-rows: 176px repeat(2, 295px);
    grid-template-columns: auto 336px;
    position: relative;
    width: 100%;
    justify-items: start;

    color: #edeeee;
  }

  .header {
    align-self: center;
    font-size: 46px;
    grid-column: span 2;
  }

  span {
    white-space: normal;
  }

  .left {
    margin-left: 150px;
  }

  .row {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-size: 34px;
    padding-top: 22px;
  }

  .row > *:first-child {
    margin-bottom: 17px;
  }

  .bg {
    background-color: #1e1e1e;
  }

  .primary {
    color: var(--primary-color);
  }

  .secondary {
    color: #1e1e1e;
  }

  .bold {
    font-weight: bold;
  }
</style>
