import re
import csv
import json
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
  """ TODO: We need to add more attributes, Wenyu will investigate on this """
  return [
    {
      "title": event['title'],
      "location": event['location'],
      "description": strip_html(event['description']),
      "date": event['date']
    }
    for event in events
  ]

def write_to_csv(FILE_PATH, data):
  keys = data[0].keys()
  with open(FILE_PATH, "w", newline="", encoding="utf-8") as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    dict_writer.writerows(data)
