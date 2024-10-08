import axios from "axios";
import { event_list_items } from "./events";

const chatbot_response = (user_input) => {

  // show loading while requesting chatbot response
  const agent_input_area = document.getElementById("agent-input-area");
  agent_input_area.value = "Generating response ...";
  
  axios.get("/api/get_chatbot_response", {
    params: {
      query: user_input
    }
  }).then(result => {
    agent_input_area.value = result.data.response;
    console.log("Chatbot response: ", result.data);
    // list all events
    event_list_items(result.data.events);
  }).catch(error => {
    console.log(error);
  });

};

export {
  chatbot_response
};
