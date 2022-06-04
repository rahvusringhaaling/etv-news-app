import { derived, get, writable } from 'svelte/store';
import { schedule } from './schedule';

function createCurrent() {
  const index = writable(0);
  const current = derived([schedule, index], ([$schedule, $index]) => $schedule[$index] || null);

  console.log();

  return {
    subscribe: current.subscribe,
    set: index.set,
    next: () => index.update(n => Math.min(n + 1, get(schedule).length - 1)),
  };
}

export const current = createCurrent();