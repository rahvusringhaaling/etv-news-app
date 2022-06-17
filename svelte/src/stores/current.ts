import { derived, get, writable } from 'svelte/store';
import { schedule } from './schedule';

const indexStore = writable(0);
const currentStore = derived([schedule, indexStore], ([$schedule, $index]) => $schedule[$index] || null);
const previousStore = derived([schedule, indexStore], ([$schedule, $index]) => $schedule[$index - 1] || null);
const nextStore = derived([schedule, indexStore], ([$schedule, $index]) => $schedule[$index + 1] || null);

function createCurrent() {
  return {
    subscribe: currentStore.subscribe,
    set: indexStore.set,
    next: () => indexStore.update(n => Math.min(n + 1, get(schedule).length - 1))
  };
}

function createPrevious() {
  return {
    subscribe: previousStore.subscribe
  }
}

function createNext() {
  return {
    subscribe: nextStore.subscribe
  }
}

export const previous = createPrevious();
export const current = createCurrent();
export const next = createNext();
