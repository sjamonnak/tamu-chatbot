import re
import csv
import json
import html
import urllib.request

def load_data(URL):
  with urllib.request.urlopen(URL) as url:
    data = json.load(url)
  return data

def strip_html(text):
  """ remove HTML tags from a string """
  if not isinstance(text, str):
    return ""
  clean = re.compile("<.*?>")
  return re.sub(clean, "", text)

def preprocess_events(events):
  """ construct dictionary from event data """
  return [
    {
      "title": event["title"],
      "group_title": event["group_title"],
      "url": event["url"],
      "description": strip_html(event["description"]),
      "date": event["date"],
      "date_time": event["date_time"],
      "location": event["location"],
      "location_title": event["location_title"],
      "location_latitude": event["location_latitude"],
      "location_longitude": event["location_longitude"],
      "cost": event["cost"],
      "thumbnail": event["thumbnail"],
      "event_types": event["event_types"],
      "event_types_audience": event["event_types_audience"],
    }
    for event in events
  ]

def transform_event_to_sentence(event):
  # extract fields from the event record
  title = event.get("title", None)
  group_title = event.get("group_title", None)
  date = event.get("date", None)
  date_time = event.get("date_time", None)
  location = event.get("location", None)
  description = event.get("description", "").strip()
  location_title = event.get("location_title", None)
  cost = event.get("cost", None)
  event_types = event.get("event_types", None)
  event_types_audience = event.get("event_types_audience", None)
  url = event.get("url", None)

  sentence = ""
  sentence += f"The event titled '{title}' " if title else "The event with no title "
  sentence += f"is organized by {group_title} " if group_title else ""
  sentence += f"and is scheduled to take place on {date}." if date else ""
  sentence += f" At {date_time}." if date_time else ""
  sentence += f" The event will be held at {location}." if location else ""
  sentence += f" ({location_title})." if location_title else ""
  sentence += f" The cost for attending is {cost}." if cost else " The cost for attending is FREE."
  sentence += f" Description: {description}." if description else ""
  sentence += f" This event is categorized under {event_types[0]}." if event_types else ""
  sentence += f" The intended audience for this event is for {','.join(event_types_audience)}." if event_types_audience else ""
  sentence += f" For more details, you can visit the event page at {url}." if url else ""

  return html.unescape(sentence)
