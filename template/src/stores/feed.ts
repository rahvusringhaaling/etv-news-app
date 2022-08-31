import { writable } from 'svelte/store';
import type { IFeed } from '../types/IFeed';

export const feed = writable<IFeed>({});