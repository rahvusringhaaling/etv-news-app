<script lang="ts">
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import Content from './components/Content/ContentContainer.svelte';
  import Right from './components/Right/RightContainer.svelte';
  import { Api } from './services/Api';
  import { portals } from './stores/portals';
  import { feed } from './stores/feed';

  onMount(async () => {
    Api.sendHeartbeat();
    setInterval(Api.sendHeartbeat, 3000);

    feed.set(await Api.getTVFeed());
    portals.set(await Api.getPortals());

    setColors('#2E3192', '#EEEEEE');
    // setColors('#DAB230', '#1E1E1E');
    // setColors('#BD2020', '#EEEEEE');
    // setColors('#503084', '#EEEEEE');
    // setColors('#66A133', '#EEEEEE');
  });

  // #2E3192 => rgba(46, 49, 146, 0.1)
  function hexToRgba(hex: string) {
    const integer = parseInt(hex.substring(1), 16);
    const r = (integer >> 16) & 255;
    const g = (integer >> 8) & 255;
    const b = integer & 255;
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }

  function setColors(primary: string, text: string) {
    const root = document.querySelector(':root') as HTMLElement;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--background', hexToRgba(primary));
    root.style.setProperty('--text', text);
  }
</script>

<main>
  <div class="root-container" style="">
    <Header />
    <div class="bottom-container">
      <Content />
      <Right />
    </div>
  </div>
</main>

<style>
  .root-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #dddddd;
    max-width: 1920px;
    max-height: 1080px;
  }

  .bottom-container {
    display: flex;
  }
</style>
