import os
import json
import re
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from routing import calculate_optimal_route

# Ensure .env is read reliably
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)

app = FastAPI(title="Hydro Blueprint Routing API")

# Allow the frontend to connect without CORS blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-blueprint")
async def upload_blueprint(image: UploadFile = File(...)):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set in .env")

        contents = await image.read()
        client = genai.Client(api_key=api_key)
        
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                types.Part.from_bytes(data=contents, mime_type=image.content_type or "image/jpeg"),
                "Extract all rooms, fixtures, and structural layout data from this blueprint into clean JSON format."
            ]
        )
        
        # Clean markdown code blocks if present
        raw_text = response.text.strip()
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        
        try:
            analysis_data = json.loads(cleaned)
        except Exception:
            analysis_data = raw_text

        routing_data = calculate_optimal_route()
        
        return {
            "blueprint_analysis": analysis_data,
            "optimal_route": routing_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)