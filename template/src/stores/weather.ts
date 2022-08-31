import { writable } from 'svelte/store';
import type { IForecastItem } from '../types/IForecastItem';
import type { IObservationItem } from '../types/IObservationItem';
import type { IObservationsMap } from '../types/IObservationsMap';

export const observations = writable<IObservationItem[]>([]);
export const observationsMap = writable<IObservationsMap>();
export const forecast = writable<IForecastItem[]>([]);