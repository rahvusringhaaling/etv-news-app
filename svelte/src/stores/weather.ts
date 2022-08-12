import { writable } from 'svelte/store';
import type { IForecastItem } from '../domain/IForecastItem';
import type { IObservationItem } from '../domain/IObservationItem';
import type { IObservationsMap } from '../domain/IObservationsMap';

export const observations = writable<IObservationItem[]>([]);
export const observationsMap = writable<IObservationsMap>();
export const forecast = writable<IForecastItem[]>([]);