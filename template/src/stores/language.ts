import { Language } from "../types/Language";
import { writable } from "svelte/store";

export const language = writable<Language>(Language.Estonian);
