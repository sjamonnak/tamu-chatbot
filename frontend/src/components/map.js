import { Deck } from '@deck.gl/core';
import { IconLayer, Tile3DLayer } from 'deck.gl';
import { _TerrainExtension as TerrainExtension} from "@deck.gl/extensions";

const GOOGLE_API_KEY = atob("QUl6YVN5RE1JOXkzdDVhcmY4T1NtUTd0ZlFhbC1udGVCNnNQVGQw");
const TILESET_URL = "https://tile.googleapis.com/v1/3dtiles/root.json";
let current_tilelayer = undefined;
let the_deck = undefined;

const default_view_state = {
  zoom: 16,
  bearing: 0,
  pitch: 60,
  maxZoom: 24,
  maxPitch: 85,
  latitude: 30.6187,
  longitude: -96.3365,
};

const map_initialize = () => {
  // google 3d tile layer
  let tile_layer = new Tile3DLayer({
    id: 'google-3d-tiles',
    data: TILESET_URL,
    onTilesetLoad: (tileset3d) => {},
    loadOptions: {
      fetch: {headers: {'X-GOOG-API-KEY': GOOGLE_API_KEY }}
    },
    operation: "terrain+draw",
  });
  current_tilelayer = [tile_layer];
  // initialize deck.gl map
  the_deck = new Deck({
    canvas: 'deckgl',
    initialViewState: { ...default_view_state },
    controller: {
      touchRotate: true,
      touchZoom: true,
    },
    onViewStateChange: ({}) => {},
    onClick: ({}) => {},
    layers: [tile_layer]
  });
  // inject script
  const script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_API_KEY;
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);
  // disable right-click
  the_deck.canvas.addEventListener('contextmenu', evt => evt.preventDefault());
  return the_deck;
};

const map_draw_icons = (data) => {
  if (the_deck) {
    const tile_layer = new Tile3DLayer({
      id: 'google-3d-tiles',
      data: TILESET_URL,
      onTilesetLoad: (tileset3d) => {},
      loadOptions: {
        fetch: {headers: {'X-GOOG-API-KEY': GOOGLE_API_KEY }}
      },
      operation: "terrain+draw",
    });
    const icon_tile_layer = new IconLayer({
      id: "icon-layer",
      data: data,
      getSize: 30,
      getColor: [255, 255, 0],
      extensions: [ new TerrainExtension()],
      getIcon: d => "marker",
      getPosition: d => d.coordinates,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
      pickable: true
    });
    current_tilelayer.push(icon_tile_layer);
    the_deck.setProps({ layers: [tile_layer, icon_tile_layer] });
  }
}

export {
  map_initialize,
  map_draw_icons,
  the_deck,
}




