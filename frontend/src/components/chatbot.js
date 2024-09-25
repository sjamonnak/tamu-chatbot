import axios from "axios";
import { event_list_items } from "./events";

const chatbot_response = (input) => {
  const agent_input_area = document.getElementById("agent-input-area");
  // show loading
  agent_input_area.value = "Generating response ...";
  axios.get("/api/get_chatbot_response", {
    params: {
      query: input
    }
  }).then(result => {
    agent_input_area.value = result.data.response;
    console.log(result.data);
    // list all events
    event_list_items(result.data.events);
  }).catch(error => {
    console.log(error);
  }).finally(() => {
    // hide loading
  });
};

export {
  chatbot_response
};
