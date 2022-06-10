import { derived, get, writable } from 'svelte/store';
import { schedule } from './schedule';

const indexStore = writable(0);
const currentStore = derived([schedule, indexStore], ([$schedule, $index]) => $schedule[$index] || null);
const nextStore = derived([schedule, indexStore], ([$schedule, $index]) => $schedule[$index + 1] || null);

function createCurrent() {
  return {
    subscribe: currentStore.subscribe,
    set: indexStore.set,
    next: () => indexStore.update(n => Math.min(n + 1, get(schedule).length - 1))
  };
}

function createNext() {
  return {
    subscribe: nextStore.subscribe
  }
}

export const current = createCurrent();
export const next = createNext();
