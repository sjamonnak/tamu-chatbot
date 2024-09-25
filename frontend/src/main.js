import './main.css'
import { map_initialize } from './components/map';
import { chatbot_response } from './components/chatbot';

export let user_location_latlng = undefined;

document.addEventListener('DOMContentLoaded', () => {
  const user_ask_button = document.getElementById("user-ask-button");
  const user_input_area = document.getElementById("user-input-area");
  // add dom events
  user_ask_button.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(user_input_area.value);
    chatbot_response(user_input_area.value);
  });
  // initialize map
  map_initialize();
  // ask for user current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      user_location_latlng = [pos.coords.longitude, pos.coords.latitude];
      console.log(user_location_latlng);
      // create location button: toggle this to zoom otherwise go back to view state
      // draw user icon on the map
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
});
