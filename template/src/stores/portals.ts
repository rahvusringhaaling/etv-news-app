import { writable } from 'svelte/store';
import type { IPortal } from '../domain/IPortal';

export const portals = writable<IPortal[]>([]);