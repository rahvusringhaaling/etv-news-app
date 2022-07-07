<script lang="ts">
  import { onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { current, next } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';

  let caption: HTMLElement;
  let container: HTMLElement;
  let primaryColor = '';
  let backgroundColor = '';
  let src = '';
  let header = '';
  let author = '';
  let timeout: NodeJS.Timeout;

  const unsubscribeCurrent = current.subscribe((item) => {
    if (item && item.type === ScheduleType.Headline) {
      src = item.article!.imageURL;
      header = item.article!.header;
      author = item.article!.imageAuthor
        ? `Foto: ${item.article!.imageAuthor}`
        : '';

      primaryColor = item.portal.primaryColor;
      backgroundColor = item.portal.backgroundColor;

      gsap.fromTo(
        caption,
        { opacity: 0 },
        { opacity: 0.75, duration: 0.3, delay: 1.35 }
      );
      gsap.fromTo(
        container,
        { bottom: -150 },
        { bottom: 0, duration: 0.75, delay: 0.4 }
      );
    }
  });

  const unsubscribeNext = next.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      src = item.article!.imageURL;
    }
  });

  onDestroy(() => {
    unsubscribeCurrent();
    unsubscribeNext();
  });
</script>

<main>
  <div
    class="container"
    style="--primary-color: {primaryColor}; --background-color: {backgroundColor};"
  >
    <img {src} alt="" />
    <div class="bottom-container" bind:this={container}>
      <div class="caption" bind:this={caption}>{author}</div>
      <div class="header">{header}</div>
    </div>
  </div>
</main>

<style>
  .container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 1485px;
    height: 912px;
  }

  .bottom-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .caption {
    font-size: 30px;
    font-family: 'AvenirNextLTPro';
    padding-left: 145px;
    padding-bottom: 20px;
    text-shadow: 0px 0px 4px #000000a6;
    opacity: 0;
  }

  .header {
    display: flex;
    align-items: center;
    width: 100%;
    background-color: var(--primary-color);
    color: var(--text-color);
    font-family: 'AvenirNextLTPro';
    font-size: 55px;
    padding: 43px 30px 105px 145px;
    white-space: break-spaces;
  }
</style>
