import './main.css';
import { map_initialize } from './components/map';
import { chatbot_response } from './components/chatbot';
import { direction_set_user_location } from './components/direction';
import { utils_hide_driving_instructions } from './components/utils';

// Demo example: "Any event happens on October 5?"
document.addEventListener('DOMContentLoaded', () => {

  const user_ask_button = document.getElementById("user-ask-button");
  const user_input_area = document.getElementById("user-input-area");

  // add onclick events
  user_ask_button.addEventListener("click", (e) => {
    e.preventDefault();
    // send user query and get chatbot response
    const user_query = user_input_area.value;
    // detect empty input
    const isEmpty = str => !str.trim().length;
    if (isEmpty(user_query)) return alert("Please put your question.");
    // get chatbot response
    console.log("Question: ", user_query);
    chatbot_response(user_query);
  });

  // initialize map
  map_initialize();
  utils_hide_driving_instructions();

  // ask for user current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lnglat = [pos.coords.longitude, pos.coords.latitude];
      direction_set_user_location(lnglat);
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  
});
