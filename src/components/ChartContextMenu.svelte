<script>
  import { timeFormat } from 'd3-time-format';
  import { store, showContextMenu } from '../state/store';
  import ZoomIn from './icons/ZoomIn.svelte';

  export let data;
  export let x;
  export let y;
  export let clickedRef;
  export let clickedHov;
  export let zoomUrl;

  let elem;

  function onClickOutside(e) {
    if (elem && !elem.contains(e.target)) {
      $showContextMenu = false;
    }
  }

  function onEscape(e) {
    if (e.key === 'Escape' && $showContextMenu) {
      $showContextMenu = false;
    }
  }

  function closeMenu() {
    $showContextMenu = false;
  }

  function engageZoom() {
    store.setField('ref', clickedRef);
    store.setField('hov', clickedHov);
    store.setField('timeHorizon', 'ZOOM');
  }

  function getDateFromPoint(p) {
    if (p) {
      const found = data.find((d) => d.build_id === p);
      if (found) {
        return found.label;
      }
    }
    return data[data.length - 1].label;
  }

  const dateFormatter = timeFormat('%Y-%m-%d');
  const timeFormatter = timeFormat('%H:%M:%S');
</script>

<style>
  div#menu {
    position: absolute;
    display: grid;
    background-color: white;
    width: 300px;
    border: 2px solid #e5e7eb;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border-radius: 0.375rem;
    font-size: var(--text-02);
    color: var(--cool-gray-600);
  }
  div.head {
    margin-bottom: 5px;
    font-size: var(--text-01);
  }
  div.range {
    padding: 1px 15px;
    grid-gap: 5px;
    display: flex;
    flex-direction: row;
  }
  div.key {
    width: 20%;
    font-weight: bold;
  }
  div.value {
    font-family: var(--main-mono-font);
    width: 80%;
  }
  div.value span {
    font-weight: bold;
  }
  div.options {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 30px 1fr;
    grid-template-areas: 'option-icon option-text';
  }
  div.option {
    display: contents;
  }
  div.option:hover > div {
    background-color: #e5e7eb;
  }
  div.option-icon {
    padding: 5px 5px 5px 15px;
  }
  div.option-link {
    padding: 5px 15px 5px 5px;
  }
  div.option-icon a {
    display: block;
    cursor: pointer;
    text-decoration: none;
    color: var(--digital-blue-500);
  }
  div.option-link a {
    text-transform: uppercase;
    display: block;
    cursor: pointer;
    text-decoration: none;
    color: var(--digital-blue-500);
    font-size: var(--text-02);
  }
</style>

<svelte:body on:click={onClickOutside} on:keydown|stopPropagation={onEscape} />

{#if $showContextMenu}
  <div
    id="menu"
    style="top: {y + window.scrollY}px; left: {x + window.scrollX}px;"
    on:click={closeMenu}
    bind:this={elem}>
    <div class="head">
      <div class="range">
        <div class="key">Range:</div>
        <div class="value">
          <span>{dateFormatter(getDateFromPoint(clickedHov))}</span>
          {timeFormatter(getDateFromPoint(clickedHov))}
        </div>
      </div>
      <div class="range">
        <div class="key">to:</div>
        <div class="value">
          <span>{dateFormatter(getDateFromPoint(clickedRef))}</span>
          {timeFormatter(getDateFromPoint(clickedRef))}
        </div>
      </div>
    </div>
    <div class="options">
      <div class="option">
        <div class="option-icon">
          <a href={zoomUrl} on:click|preventDefault={engageZoom}>
            <ZoomIn size="12" />
          </a>
        </div>
        <div class="option-link">
          <a href={zoomUrl} on:click|preventDefault={engageZoom}>
            Zoom to Range
          </a>
        </div>
      </div>
      <div class="option">
        <div class="option-icon" />
        <div class="option-link">
          <i>Coming soon: PUSHLOG LINK</i>
        </div>
      </div>
    </div>
  </div>
{/if}
