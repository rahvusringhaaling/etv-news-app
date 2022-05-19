<script lang="ts">
import { onMount } from "svelte";

  import Headlines from "./Headlines.svelte";

  const headlines = [
    "Kaugkütteühingu juht: ma ei usu, et inimesed tuleval talvel külma jäävad",
    "Sutt ja Aas peavad uues kantsleris kokkuleppele jõudma",
    "Prantsuse politoloog: Venemaa kaotus toob muutuse Euroopas ja kaugemalgi",
    "Rootsi välisminister allkirjastas taotluse NATO-ga liitumiseks",
  ];

  let child: Headlines;

  onMount(() => {
    child.setActive(1);
  });
</script>

<main>
  <div class="container">
    <Headlines headlines={headlines} bind:this={child} />
    <div class="background" />
  </div>
</main>

<style>
  .container {
    display: flex;
  }

  .background {
    background-color: #cbcbd5;
    width: 955px;
    height: 912px;
  }
</style>
