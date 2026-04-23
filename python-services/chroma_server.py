from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from embed import upsert_product, delete_product, query_products
import uvicorn
from pymongo import MongoClient
from apscheduler.schedulers.background import BackgroundScheduler
import threading

app = FastAPI()
scheduler = BackgroundScheduler()

MONGO_URI = "mongodb://127.0.0.1:27017"
DB_NAME = "nearbuy"

def sync_mongodb_to_chroma():
    print("Starting MongoDB to ChromaDB sync...")
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        products = list(db.products.find({}))
        
        success = 0
        for p in products:
            try:
                pid = str(p["_id"])
                name = p.get("name", "")
                desc = p.get("description", "")
                keywords = p.get("imageKeywords", [])
                
                text_parts = [name, desc] + keywords
                text = ". ".join([str(t) for t in text_parts if t])
                
                upsert_product(pid, text)
                success += 1
            except Exception as e:
                print(f"Failed to upsert product {pid}: {e}")
                
        print(f"Successfully synced {success}/{len(products)} products from MongoDB!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

@app.on_event("startup")
def startup_event():
    # Run initial sync in a separate thread so it doesn't block startup
    threading.Thread(target=sync_mongodb_to_chroma).start()
    
    # Schedule periodic sync every 1 hour
    scheduler.add_job(sync_mongodb_to_chroma, 'interval', hours=1)
    scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()


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
