import csv
from langchain.docstore.document import Document
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings.ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma

def prepare_documents(CSV_FILE_PATH):
  # define columns we want in the embeddings and which one we want in metadata
  columns_to_embed = ["title","description"]
  columns_to_metadata = ["title", "location", "description", "date"]
  # prepare csv to a langchain document
  docs = []
  with open(CSV_FILE_PATH, newline="", encoding="utf-8") as csv_file:
    csv_reader = csv.DictReader(csv_file)
    for i, row in enumerate(csv_reader):
      to_metadata = {col: row[col] for col in columns_to_metadata if col in row}
      values_to_embed = {k: row[k] for k in columns_to_embed if k in row}
      to_embed = "\n".join(f"{k.strip()}: {v.strip()}" for k, v in values_to_embed.items())
      new_doc = Document(page_content=to_embed, metadata=to_metadata)
      docs.append(new_doc)
  # split the document using Chracter splitting.
  splitter = CharacterTextSplitter(separator = "\n",
                                  chunk_size = 1000,
                                  chunk_overlap = 0,
                                  length_function = len)
  documents = splitter.split_documents(docs)
  return documents

def get_embeddings():
  embeddings = OllamaEmbeddings(model="nomic-embed-text", show_progress=True)
  return embeddings

def store_documents(CHROMA_DIR, documents):
  # generate embeddings from documents and store in a vector database
  embeddings_model = get_embeddings()
  db = Chroma.from_documents(
    documents = documents, 
    embedding = embeddings_model,
    persist_directory = CHROMA_DIR,
  )
  db.persist()
