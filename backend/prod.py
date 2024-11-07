from waitress import serve
from app import app
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 4999))
    serve(app, host="0.0.0.0", port=port)