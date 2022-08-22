<script lang="ts">
  import { onDestroy } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../../stores/current';
  import { ScheduleType } from '../../../domain/IScheduleItem';

  export let pageCount: number;
  const curves = [
    'M10.5,.5C4.977,.5,.5,4.977,.5,10.5s4.477,10,10,10,10-4.477,10-10S16.023,.5,10.5,.5Z',
    'M60.5,10.5c0,5.523-4.477,10-10,10s-10-4.477-10-10S44.977,.5,50.5,.5s10,4.477,10,10Z',
    'M90.5,.5c-5.523,0-10,4.477-10,10s4.477,10,10,10,10-4.477,10-10S96.023,.5,90.5,.5Z',
    'm40,0c-5.523,0-10,4.477-10,10s4.477,10,10,10,10-4.477,10-10-4.477-10-10-10Z',
    'm40,0c-5.523,0-10,4.477-10,10s4.477,10,10,10,10-4.477,10-10-4.477-10-10-10Z',
  ];
  let d = '';
  let viewBox = '0 0 180.5 21';

  let active = 0;
  let circle: SVGCircleElement;

  $: {
    d = curves.slice(0, pageCount).join('');
    const width = 20 * pageCount + 20 * (pageCount - 1);
    viewBox = `0 0 ${width}.5 21`;
  }

  export function setActive(index: number, duration = 0.75) {
    active = Math.min(index, pageCount - 1);
    const x = 40 * active;
    gsap.to(circle, { x, duration: duration });
  }

  const unsubscribe = current.subscribe(async (item) => {
    if (item && item.type === ScheduleType.Text) {
      if (!circle) return;
    }
  });

  onDestroy(unsubscribe);
</script>

<main>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    {viewBox}
  >
    <defs>
      <style>
        .circle {
          clip-path: url(#d);
        }

        .f {
          fill: #aaaaaa;
        }

        .g {
          fill: none;
        }

        .h {
          fill: #373737;
        }
      </style>
      <clipPath id="d">
        <path class="g" {d} />
      </clipPath>
    </defs>
    <path id="b" data-name="BG Circles" class="f" {d} />
    <g id="c" data-name="Active Circle">
      <g class="circle">
        <circle bind:this={circle} class="h" cx="10.5" cy="10.5" r="10.5" />
      </g>
    </g>
  </svg>
</main>

<style>
  svg {
    height: 20px;
  }
</style>
