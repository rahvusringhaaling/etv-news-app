<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { current } from '../../../stores/current';
  import { ScheduleType } from '../../../domain/IScheduleItem';
  import { sleep } from '../../../utils';

  export let totalPages: number;
  const curves = [
    'M10.5,.5C4.977,.5,.5,4.977,.5,10.5s4.477,10,10,10,10-4.477,10-10S16.023,.5,10.5,.5Z',
    'M60.5,10.5c0,5.523-4.477,10-10,10s-10-4.477-10-10S44.977,.5,50.5,.5s10,4.477,10,10Z',
    'M90.5,.5c-5.523,0-10,4.477-10,10s4.477,10,10,10,10-4.477,10-10S96.023,.5,90.5,.5Z',
    'm40,0c-5.523,0-10,4.477-10,10s4.477,10,10,10,10-4.477,10-10-4.477-10-10-10Z',
    'm40,0c-5.523,0-10,4.477-10,10s4.477,10,10,10,10-4.477,10-10-4.477-10-10-10Z'
  ];
  let d = '';
  let viewBox = '0 0 180.5 21';

  let active = 0;
  let circle: SVGCircleElement;

  onMount(async () => {
    d = curves.slice(0, totalPages).join('');
    const width = 20 * totalPages + 20 * (totalPages - 1);
    viewBox = `0 0 ${width}.5 21`;

    await sleep(1000);
    setActive(10);
  });

  export function setActive(index: number) {
    active = Math.min(index, totalPages - 1);
    const x = 40 * active;
    gsap.to(circle, { x, duration: 1 });
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
