import { writable } from 'svelte/store';
import type { IPortal } from '../types/IPortal';

export const portals = writable<IPortal[]>([]);