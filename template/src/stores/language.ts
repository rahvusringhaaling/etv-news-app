import { Language } from "../domain/Language";
import { writable } from "svelte/store";

export const language = writable<Language>(Language.Estonian);
