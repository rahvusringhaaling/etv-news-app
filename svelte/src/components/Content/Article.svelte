<script lang="ts">
  import { onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../stores/current';
  import { ScheduleType } from '../../domain/IScheduleItem';
  import { sleep } from '../../utils';

  let lead = '';
  let body = '';
  let bodyContainer: HTMLElement;
  let circle: SVGCircleElement;
  const maxHeight = 950;

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Headline) {
      await sleep(1000);
      lead = item.article.lead;
      body = item.article.body;
      await sleep(0);
      const children = bodyContainer.children;

      for (const element of [...children].reverse()) {
        const { y } = element.getBoundingClientRect();
        if (y > maxHeight) {
          element.remove();
        }
      }

      const last = children[children.length - 1];
      if (last.firstChild.nodeType === Node.TEXT_NODE) {
        const words = last.firstChild.textContent.split(' ');
        console.log(words);

        for (let i = words.length; i >= 0; i--) {
          const { y, height } = last.getBoundingClientRect();
          if (y + height <= maxHeight) {
            break;
          }
          last.firstChild.textContent = words.slice(0, i).join(' ');
        }
      }
    } else {
      if (!circle) return;
      gsap.fromTo(circle, { x: 0 }, { x: 40, duration: 1, delay: 1 });
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <div class="text-container">
    <p class="lead">{@html lead}</p>
    <p class="body" bind:this={bodyContainer}>{@html body}</p>
  </div>
  <div class="circle-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 100.5 21"
    >
      <defs
        ><style>
          .cls-1 {
            fill: none;
          }
          .cls-2 {
            fill: #aaaaaa;
          }
          .cls-3 {
            clip-path: url(#clip-path);
          }
          .cls-4 {
            fill: #373737;
          }
        </style>
        <clipPath id="clip-path">
          <path
            class="cls-1"
            d="M60.5,10.5a10,10,0,1,1-10-10A10,10,0,0,1,60.5,10.5Zm30-10a10,10,0,1,0,10,10A10,10,0,0,0,90.5.5Zm-80,0a10,10,0,1,0,10,10A10,10,0,0,0,10.5.5Z"
          />
        </clipPath>
      </defs>
      <path
        id="BG_Circles"
        data-name="BG Circles"
        class="cls-2"
        d="M60.5,10.5a10,10,0,1,1-10-10A10,10,0,0,1,60.5,10.5Zm30-10a10,10,0,1,0,10,10A10,10,0,0,0,90.5.5Zm-80,0a10,10,0,1,0,10,10A10,10,0,0,0,10.5.5Z"
      />
      <g id="Active_Circle" data-name="Active Circle">
        <g class="cls-3">
          <circle
            bind:this={circle}
            class="cls-4"
            cx="10.5"
            cy="10.5"
            r="10.5"
          />
        </g>
      </g>
    </svg>
  </div>
</main>

<style>
  .text-container {
    width: 955px;
    height: 905px;
    color: #282828;
    font-family: 'AvenirNextLTPro';
    font-size: 40px;
    padding: 40px 40px 0 95px;
  }

  .lead :global(p) {
    font-weight: 600;
    padding-bottom: 10px;
  }

  .body :global(*),
  .lead :global(*) {
    white-space: break-spaces;
  }

  .circle-container {
    display: flex;
    justify-content: center;
    width: 955px;
    position: absolute;
    bottom: 50px;
    gap: 20px;
  }

  svg {
    height: 20px;
  }
</style>
