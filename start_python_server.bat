@echo off
echo Starting Python ChromaDB Server...
cd python-services
python -m uvicorn chroma_server:app --port 8000 --host 0.0.0.0
pause
