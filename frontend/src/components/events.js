import { FlyToInterpolator } from "deck.gl";
import { map_draw_icons, the_deck } from "./map";

const event_list_items = (events) => {
  const event_container = document.getElementById("event-container");
  event_container.innerHTML = "";
  let locations = [];
  for (let i = 0; i < events.length; ++i) {
    const event = events[i];
    // create event item
    const event_item = document.createElement("div");
    event_item.className = "event-item";
    // add event thumbnail and event info
    const event_thumbnail = document.createElement("div");
    event_thumbnail.className = "event-thumbnail";
    const event_info = document.createElement("div");
    event_info.className = "event-info";
    // add image to event_thumbnail
    const thumbnail_src = event["thumbnail"];
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

    // add click event or marker here
    if (event["location_latitude"] != null && event["location_longitude"] != null) {
      event_item.addEventListener("click", () => {
        if (the_deck) {
          the_deck.setProps({
            initialViewState: {
              longitude: parseFloat(event["location_longitude"]),
              latitude: parseFloat(event["location_latitude"]),
              zoom: 16,
              bearing: 0,
              pitch: 60,
              maxZoom: 24,
              maxPitch: 85,
            },
            transitionInterpolator: new FlyToInterpolator({ speed: 2}),
            transitionDuration: "auto",
          });
        }
      });
      // add icon position
      locations.push({
        coordinates: [parseFloat(event["location_longitude"]), parseFloat(event["location_latitude"])],
      })
    }
  }
  // draw icons on the map
  map_draw_icons(locations);
};

export {
  event_list_items
}
