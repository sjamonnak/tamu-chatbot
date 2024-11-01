import { map_draw_origin_destination_points, map_draw_travel_routes, map_remove_traveling_path } from "./map";
import { direction_get_user_location } from "./direction";
import { utils_hide_driving_instructions } from "./utils";

// no image url
const NO_IMAGE_URL = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?b=1&s=170667a&w=0&k=20&c=15h-R1m3LzsEj1TI_oiia41F0L0uLXNqBTHZKnn43BI=";

// list all events
const event_list_items = (events) => {

  const event_container = document.getElementById("event-container");
  event_container.innerHTML = "";
  
  for (let i = 0; i < events.length; ++i) {
    const index = i;
    const event = events[i];
    // create event item
    const event_item = document.createElement("div");
    event_item.id = "event-item-" + i;
    event_item.className = "event-item";
    // add event thumbnail and event info
    const event_thumbnail = document.createElement("div");
    event_thumbnail.className = "event-thumbnail";
    const event_info = document.createElement("div");
    event_info.className = "event-info";
    // add image to event_thumbnail
    const thumbnail_src = event["thumbnail"] ? event["thumbnail"] : NO_IMAGE_URL;
    const thumbnail_img = document.createElement('img');
    thumbnail_img.src = thumbnail_src;
    thumbnail_img.width = 100;
    thumbnail_img.height = 100;
    event_thumbnail.appendChild(thumbnail_img);
    // add information to event_info
    event_info.innerHTML = "<label>Title: " + event["title"] + "</label><br/>";
    event_info.innerHTML += "<label>Date: " + event["date"] + " Time: " + event["date_time"] + "</label><br/>";
    event_info.innerHTML += "<label>Location: " + event["location"] + "</label><br/>";
    event_info.innerHTML += "<label>Description: " + event["description"] + "</label><br/>";
    event_info.innerHTML += "<label>URL: <a href=\'" + event["url"] + "\'>link</a></label>"
    event_item.appendChild(event_thumbnail);
    event_item.appendChild(event_info);
    event_container.append(event_item);
    // draw travel path on click
    event_item.addEventListener("click", (e) => {
      // clear all event items background
      const all_event_items = document.getElementsByClassName("event-item");
      for(var i = 0 ; i < all_event_items.length; ++i){
        console.log(all_event_items[i]);
        all_event_items[i].style.background = "#ffffff";
      }
      // highlight selected event item
      const this_event_item = document.getElementById("event-item-" + index);
      this_event_item.style.background = "#fee391";
      event_display_travel_path(event);
    });
  }
};

// draw evet travel path
const event_display_travel_path = (event) => {
  const user_loc = direction_get_user_location(); // [lng, lat]
  const dest_lng = event["location_longitude"];
  const dest_lat = event["location_latitude"];
  
  if (!user_loc || dest_lng == null || dest_lat == null) {
    // clear all travel_path
    map_remove_traveling_path();
    utils_hide_driving_instructions();
  } else {
    // get travel path and draw it on the map
    const destination_lnglat = [parseFloat(dest_lng), parseFloat(dest_lat)];
    map_draw_travel_routes(user_loc, destination_lnglat);
    map_draw_origin_destination_points([user_loc, destination_lnglat]);
  }
};

export {
  event_list_items
};
