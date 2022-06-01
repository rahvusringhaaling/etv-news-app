<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import Headlines from './Headlines.svelte';

  let child: Headlines;
  let bar: HTMLElement;
  let i = 1;

  onMount(async () => {
    gsap.fromTo(
      bar,
      { width: 530 },
      { width: 1485, duration: 12, ease: 'none' }
    );
    child.setActive(0);

    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        child.setActive(i);
        i++;
      }
    });
  });
</script>

<main>
  <div class="container">
    <div class="bar" bind:this={bar} />
    <div class="bottom-container">
      <Headlines bind:this={child} />
      <div class="article" />
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    background-color: var(--background);
  }

  .bar {
    background-color: var(--primary);
    height: 7px;
    width: 530px;
  }

  .bottom-container {
    display: flex;
  }

  .article {
    width: 955px;
    height: 905px;
  }
</style>
