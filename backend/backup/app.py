import os
import json
from flask import Flask, request, jsonify
from preprocess import load_data, preprocess_events, write_to_csv
from _ollama import prepare_documents, store_documents, get_embeddings
from langchain_community.llms import Ollama
from langchain_core.output_parsers import StrOutputParser

CSV_FILE_PATH = os.path.join("..", "data", "tamu_events.csv")
CHROMA_DIR = "./chroma"
TAMU_EVENTS_URL = "https://calendar.tamu.edu/live/json/events/group"

# load Ollama model
print("Load Ollama model and Chroma database ...")
ollama_model = Ollama(model="mistral")
# load database
chroma_db = Chroma(persist_directory=CHROMA_DIR, embedding_function=get_embeddings(), collection_name='v_db')
# initialize flask application
app = Flask(__name__)

@app.route("/generate", methods=["POST"])
def generate_response():
  try:
    # get query input from the user
    bytes_value = request.data.decode('utf8').replace("'", '"')
    data = json.loads(bytes_value)
    query = data["query"]
    # search relevant events
    relevant_events = chroma_db.similarity_search(query)
    print(relevant_events)
    # create events context
    context_text = "\n\n".join(f"Event {i+1}:\n{event}" for i, event in enumerate(relevant_events))
    # create prompt for ollma
    prompt = f"""
    You are an AI assistant, your task is to get five relevant events as context.
    Plase answer the question based only on the following context, as briefly as possible:
    {context_text}
    ---
    Question: {query}
    Answer:
    """
    response = ollama_model.invoke(prompt)
    print("Context: ", context_text)
    print("Response:", response)
    return jsonify({"response": response})
  except Exception as e:
    return jsonify({"error": str(e)}), 500
  
if __name__ == "__main__":
  """
  # preprocessing and write to csv file
  print("Load events data from TAMU website ...")
  data = load_data(TAMU_EVENTS_URL)
  print("Preprocessing data ...")
  preprocessed_data = preprocess_events(data)
  print("Write preprocessed data to csv file ...")
  write_to_csv(CSV_FILE_PATH, preprocessed_data)
  # prepare csv file, and store it in database
  print("Store csv file into a database ...")
  documents = prepare_documents(CSV_FILE_PATH)
  print("Store documents ...")
  store_documents(CHROMA_DIR, documents)
  print("Start flask application ...")
  """
  app.run(host="0.0.0.0", port=5000, debug=True)
