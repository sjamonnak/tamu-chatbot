## AggieMapBot - TAMU Assistant ChatBot

> An Intelligent Campus Assistant: Combining Assistive Chatbot and Digital Twin for Enhanced Event and Course Navigation

### Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.

### Frontend Setup
```bash
$ cd frontend
$ npm install
```

### Backend Setup
```bash
$ cd backend
$ python -m venv venv # set up python environment
$ source venv/bin/activate # or venv\Scripts\activate (Windows)
$ pip install -r requirements.txt # install all required packages
```

### Setup Ollama locally
First, you need to download [Ollma](https://ollama.com/download)
Then pull a model by running these commands:
```bash
# llm model
$ ollama pull mistral
# run Ollama
$ ollama serve
```

### Start application
Go back to home directory and start both backend and frontend separately.
```bash
# startbackend
$ cd backend
$ python app.py
# start frontend
$ cd frontend
$ npm run dev
```

Local application can be accessed at: [http://localhost:5173/](http://localhost:5173/)

### Authors and Contacts
Suphanut Jamonnak ([j.suphanut@tamu.edu](mailto:j.suphanut@tamu.edu?subject=[GitHub]%20Source%20Han%20Sans))<br/>
Wenyu Zhang ([wenyu.zhang@tamu.edu](mailto:wenyu.zhang@tamu.edu?subject=[GitHub]%20Source%20Han%20Sans))<br/>
Regina Ye ([reginay3@gmail.com](mailto:reginay3@gmail.com?subject=[GitHub]%20Source%20Han%20Sans))<br/>
Xinyue Ye ([xinyue.ye@tamu.edu](mailto:xinyue.ye@tamu.edu?subject=[GitHub]%20Source%20Han%20Sans))<br/>
