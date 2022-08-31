import { writable } from 'svelte/store';
import type { IScheduleItem } from '../types/IScheduleItem';

export const schedule = writable<IScheduleItem[]>([]);
