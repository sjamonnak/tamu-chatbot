// mapbox access token
const utils_get_mapbox_token = () => {
  return "pk.eyJ1IjoicGFybmRlcHUiLCJhIjoiY20xam8yYzZpMDNxOTJscHlncHI3OXZmZCJ9.LItUIAG1L1DrNugKyb4V4g";
};

// clear driving instructions
const utils_hide_driving_instructions = () => {
  const instructions = document.getElementById("instructions");
  const instructions_body = document.getElementById("instructions-body");
  instructions_body.innerHTML = "";
  return instructions.style.visibility = "hidden";
};

// show driving insturctions
const utils_show_driving_instructions = (data) => {

  const instructions = document.getElementById("instructions");
  const instructions_body = document.getElementById("instructions-body");
  // get travvel steps
  const steps = data.legs[0].steps;
  // create trip instructions
  let tripInstructions = '';
  for (const step of steps) {
    tripInstructions += `<li>${step.maneuver.instruction}</li>`;
  }
  // create trip durations
  instructions_body.innerHTML = `<p><strong>Trip duration: ${Math.floor(
    data.duration / 60
  )} min 🚗 </strong></p><ol>${tripInstructions}</ol>`;
  return instructions.style.visibility = "visible";
};

export {
  utils_get_mapbox_token,
  utils_hide_driving_instructions,
  utils_show_driving_instructions,
};
