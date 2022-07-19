<script lang="ts">
  import { onMount } from 'svelte';
  import { Api } from '../../services/Api';

  onMount(async () => {
    console.log(await Api.instance.getWeatherObservations());
  });
</script>

<main>
  <div id="container">
    <p>Tallinn-Harku</p>
    <div>
      <img src="/assets/icons/pilv_paike.png" alt="" />
      <p>7,8°C</p>
    </div>
  </div>
</main>

<style>
  #container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 435px;
    height: 479px;
    background-color: #dddddd;
    padding-left: 70px;
    padding-top: 45px;
  }

  #container > div {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  #container > div > p {
    padding-left: 8px;
    font-weight: bold;
  }

  p {
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    color: #1d1d1d;
  }

  img {
    width: 150px;
    height: 150px;
  }
</style>
