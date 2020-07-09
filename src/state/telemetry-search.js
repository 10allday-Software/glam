import { readable, derived } from 'svelte/store';
import FlexSearch from 'flexsearch';
// FIXME: this dependency cycle is innocuous but we should fix it.
import { store } from './store'; // eslint-disable-line import/no-cycle

// TODO: Make this dynamic based on prod vs local dev.
const url = '__BASE_DOMAIN__/api/v1/probes/';

export const probeSet = readable(undefined, async (set) => {
  const resp = await fetch(url).then((r) => r.json());
  const data = Object.keys(resp.probes).map((key, i) => ({
    id: i,
    ...resp.probes[key],
  }));
  set(data);
});
