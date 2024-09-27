import axios from "axios";
import { utils_get_mapbox_token } from "./utils";

let user_current_lnglat = undefined;

// set user current location
const direction_set_user_location = (lnglat) => {
  return user_current_lnglat = lnglat;
};

// get user current location
const direction_get_user_location = (lnglat) => {
  return user_current_lnglat;
};

/**
 * get request from mapbox-direction api
 * @param {2d_array} start: start lnglat
 * @param {2d_array} end: end lnglat
 * @param {string} travel_type: walking, driving-traffic, driving, cycling
 * @returns 
 */
const direction_get_travel = async (start, end, travel_type) => {
  return axios.get(`https://api.mapbox.com/directions/v5/mapbox/${travel_type}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${utils_get_mapbox_token()}`);
};

export {
  direction_set_user_location,
  direction_get_user_location,
  direction_get_travel,
};
