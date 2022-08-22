import { writable } from 'svelte/store';
import type { IScheduleItem } from '../domain/IScheduleItem';

export const schedule = writable<IScheduleItem[]>([]);
