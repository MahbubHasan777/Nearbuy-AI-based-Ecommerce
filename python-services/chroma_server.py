from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from embed import upsert_product, delete_product, query_products
import uvicorn

app = FastAPI()


class UpsertRequest(BaseModel):
    product_id: str
    text: str


class QueryRequest(BaseModel):
    query: str
    n_results: int = 20


@app.post("/upsert")
def upsert(req: UpsertRequest):
    upsert_product(req.product_id, req.text)
    return {"status": "ok"}


@app.delete("/delete/{product_id}")
def delete(product_id: str):
    delete_product(product_id)
    return {"status": "ok"}


@app.post("/query")
def query(req: QueryRequest):
    results = query_products(req.query, req.n_results)
    ids = results["ids"][0] if results["ids"] else []
    distances = results["distances"][0] if results["distances"] else []
    return {
        "results": [
            {"product_id": pid, "distance": dist}
            for pid, dist in zip(ids, distances)
        ]
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
