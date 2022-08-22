import { writable } from 'svelte/store';
import type { IFeed } from '../domain/IFeed';

export const feed = writable<IFeed>({});