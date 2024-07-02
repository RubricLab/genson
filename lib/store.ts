import { atom } from "jotai";

const dataStore = atom<Record<string, string>>({});

export default dataStore;