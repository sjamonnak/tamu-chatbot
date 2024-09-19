import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import GPT2LMHeadModel, GPT2Tokenizer

app = Flask(__name__)
CORS(app)

# load model and tokenizer
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

@app.route("/generate", methods=["POST"])
def generate_response():
  try:
    bytes_value = request.data.decode('utf8').replace("'", '"')
    data = json.loads(bytes_value)
    prompt = data["prompt"]
    max_length = data.get("max_length", 50)
    # encode input
    inputs = tokenizer.encode(prompt, return_tensors="pt")
    # generate response
    outputs = model.generate(
      inputs,
      max_length = max_length,
      pad_token_id = tokenizer.eos_token_id
    )
    # decode output
    generated_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return jsonify({"response": generated_response})
  except Exception as e:
    return jsonify({"error": str(e)}), 500
  
if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000, debug=True)
