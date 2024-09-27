import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from langchain_community.llms import Ollama
from preprocess import load_data, preprocess_events, transform_event_to_sentence

TAMU_EVENTS_URL = "https://calendar.tamu.edu/live/json/events/group"

# initialize flask application
app = Flask(__name__)
CORS(app)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
llm_model = Ollama(model="mistral")
preprocessed_events = None
data_embeddings = None

@app.route("/")
def helloWorld():
  return "Hello, cross-origin-world!"

@app.route("/get_chatbot_response", methods=["GET"])
def get_chatbot_response():
  if preprocessed_events is not None and data_embeddings is not None:
    # get query and create embedding
    query = request.args.get("query")
    query_embedding = embedding_model.encode(query)
    # compute cosine similarity between query and all data embeddings
    similarities = cosine_similarity([query_embedding], data_embeddings).flatten()
    top_5_indices = similarities.argsort()[::-1][:5]
    top_5_events = [texts[i] for i in top_5_indices]
    context_text = "\n".join(f"Event {i+1}:\n{event}" for i, event in enumerate(top_5_events))
    print(context_text)
    # prompt engineering
    prompt = f"""
    Answer the question based only on the following context, as briefly as possible:
    {context_text}
    ---
    Question: {query}
    Answer:
    """
    response = llm_model.invoke(prompt)
    print("Response:", response)
    return jsonify({
      "response": response,
      "events": [preprocessed_events[i] for i in top_5_indices]
    })
  else:
    return jsonify({"error": "Fetch errors."}), 500
  
if __name__ == "__main__":
  events = load_data(TAMU_EVENTS_URL)
  preprocessed_events = preprocess_events(events)
  texts = []
  for e in preprocessed_events:
    sentence = transform_event_to_sentence(e)
    texts.append(sentence)
  data_embeddings = embedding_model.encode(texts)
  app.run(host="0.0.0.0", port=4999, debug=True)
