from chromadb import PersistentClient
from chromadb.utils import embedding_functions
import os

client = PersistentClient(path="./chroma_db")

ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

collection = client.get_or_create_collection(
    name="products",
    embedding_function=ef,
)


def upsert_product(product_id: str, text: str):
    collection.upsert(
        ids=[product_id],
        documents=[text],
    )


def delete_product(product_id: str):
    collection.delete(ids=[product_id])


def query_products(query_text: str, n_results: int = 20):
    results = collection.query(
        query_texts=[query_text],
        n_results=n_results,
        include=["distances", "documents"],
    )
    return results
