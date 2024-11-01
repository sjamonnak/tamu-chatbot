import { Deck } from '@deck.gl/core';
import { 
  // IconLayer, 
  Tile3DLayer, 
  PathLayer, 
  FlyToInterpolator, 
  ScatterplotLayer
} from 'deck.gl';
import { 
  _TerrainExtension as TerrainExtension, 
  PathStyleExtension as _PathStyleExtension
} from "@deck.gl/extensions";
import { direction_get_travel } from './direction';
import { utils_show_driving_instructions } from './utils';

const GOOGLE_API_KEY = atob("QUl6YVN5RE1JOXkzdDVhcmY4T1NtUTd0ZlFhbC1udGVCNnNQVGQw");
const TILESET_URL = "https://tile.googleapis.com/v1/3dtiles/root.json";

let the_deck = undefined;
// tile_layers: use this to manage all tile layers in deck.gl
let _tile_layers = {
  google_3d: undefined,
  travel_path: undefined, // pathlayer
  origin_destination_point: undefined,
  // current location icon
  // destination icon
};

// default deck.gl view state
const default_view_state = {
  zoom: 16,
  bearing: 0,
  pitch: 60,
  maxZoom: 24,
  maxPitch: 85,
};

// get all tile layers
const map_get_tile_layers = () => {
  return Object.keys(_tile_layers).map(key => _tile_layers[key]);
};

const map_initialize = () => {

  // google 3d tile layer
  _tile_layers.google_3d = new Tile3DLayer({
    id: 'google-3d-tiles',
    data: TILESET_URL,
    onTilesetLoad: (tileset3d) => {},
    loadOptions: {
      fetch: {headers: {'X-GOOG-API-KEY': GOOGLE_API_KEY }}
    },
    opacity: 0.7,
    operation: "terrain+draw",
  });

  // initialize deck.gl map
  the_deck = new Deck({
    canvas: 'deckgl',
    initialViewState: { 
      longitude: -96.3365,
      latitude: 30.6187,
      ...default_view_state
    },
    controller: {
      touchRotate: true,
      touchZoom: true,
    },
    onViewStateChange: ({}) => {},
    onClick: ({}) => {},
    layers: map_get_tile_layers(),
  });

  // inject script
  const script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=" + GOOGLE_API_KEY;
  script.defer = true;
  script.async = true;
  document.head.appendChild(script);

  // disable right-click
  console.log(the_deck);
  the_deck.canvas.addEventListener('contextmenu', evt => evt.preventDefault());
  return the_deck;
};

// draw traveling routes
const map_draw_travel_routes = (origin, destination) => {
  // get travel path and draw it on the map
  direction_get_travel(origin, destination, "driving").then((res) => {
    console.log("route data: ", res);
    const data = res.data.routes[0];
    const route = data.geometry.coordinates;
    // draw travel path
    _tile_layers.travel_path = new PathLayer({
      id: "travel-path",
      data: [{route}],
      getPath: d => d.route,
      getWidth: 10,
      getColor: [255, 255, 0],
      // getDashArray: [4, 3],
      // dashJustified: false,
      extensions: [
        // new _PathStyleExtension({highPrecisionDash: true}),
        new TerrainExtension(),
      ],
    });
    // console.log(map_get_tile_layers());
    the_deck.setProps({ layers: [...map_get_tile_layers()] });
    // fly to coordinates
    map_fly_to_center(origin);
    utils_show_driving_instructions(data);
  });
  return;
};

// draw origin and destination point
const map_draw_origin_destination_points = (points) => {
  const processed_data = [{
    coordinates: points[0],
    color: [26,152,80],
  }, {
    coordinates: points[1],
    color: [215,48,39],
  }]
  _tile_layers.origin_destination_point = new ScatterplotLayer({
    id: "point-layer",
    data: processed_data,
    getPosition: d => d.coordinates,
    getRadius: 12,
    getFillColor: d => d.color,
    radiusScale: 6,
    pickable: true,
    extensions: [ new TerrainExtension() ],
  });
  return the_deck.setProps({ layers: [...map_get_tile_layers()] });
};

// remove all map traveling path
const map_remove_traveling_path = () => {
  _tile_layers.travel_path = undefined;
  _tile_layers.origin_destination_point = undefined;
  map_fly_to_center([-96.3365, 30.6187]);
  return the_deck.setProps({ layers: [...map_get_tile_layers()] });
};

// fly map to sepecific center
const map_fly_to_center = (center) => {
  the_deck.setProps({
    initialViewState: {
      longitude: center[0],
      latitude: center[1],
      ...default_view_state,
      zoom: 17,
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
      transitionDuration: "auto",
    },
  });
};

export {
  map_initialize,
  the_deck,
  map_draw_origin_destination_points,
  map_draw_travel_routes,
  map_remove_traveling_path,
};




