import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/generate", {
        query: input,
      });
      console.log(result.data.response);
      setResponse(result.data.response);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  };

  return (
    <div>
      <h2>Chat with GPT-2</h2>
      <form onSubmit={handle_submit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask any question?"
          rows="5"
          width="100%"
        />
        <br/>
        <button type="submit">Submit</button>
      </form>
      <h2>Response:</h2>
      <p>{response}</p>
    </div>
  );
};

export default Chatbot;
