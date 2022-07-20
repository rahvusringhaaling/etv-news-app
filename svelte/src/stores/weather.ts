import { writable } from 'svelte/store';
import type { IObservationItem } from '../domain/IObservationItem';

export const observations = writable<IObservationItem[]>([]);