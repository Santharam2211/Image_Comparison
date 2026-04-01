import cv2
import numpy as np
import time
import pandas as pd
import os
import random
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from skimage.metrics import structural_similarity as ssim

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXCEL_FILE = "comparisons.xlsx"
ROUND2_FILE = "round2_assignments.xlsx"

# Use absolute path to ensure predefined images are found correctly
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend", "src", "assets"))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

PREDEFINED_IMAGES = {
    "ClothShop": os.path.join(ASSETS_DIR, "ClothShop.png"),
    "Foodie": os.path.join(ASSETS_DIR, "Foodie.png"),
    "Musicify": os.path.join(ASSETS_DIR, "Musicify.png"),
}

TOPICS = [
    "Food Delivery Website", "Music Streaming App", "Movie Listing Website", 
    "Portfolio Website", "Hotel Booking Website", "Travel Planner", 
    "Online Course Platform", "News Website", "Job Portal", "Social Media UI", 
    "Chat Application UI", "Banking Dashboard", "Healthcare Website", 
    "Shopping Cart Page", "Event Management Website", "Gaming Website", 
    "Weather App UI", "Billing/Invoice Page", "College Website", "E-Commerce Store"
]

def init_excel():
    if not os.path.exists(EXCEL_FILE):
        df = pd.DataFrame(columns=["Team Name", "Event Name", "Category", "Similarity Percentage", "Uploaded Image Path"])
        df.to_excel(EXCEL_FILE, index=False)

init_excel()

def compare_images(img1_path, img2_bytes):
    # Read the predefined image
    img1 = cv2.imread(img1_path)
    if img1 is None:
        raise ValueError(f"Could not read image: {img1_path}")
    img1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    
    # Read the uploaded image
    nparr = np.frombuffer(img2_bytes, np.uint8)
    img2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img2 is None:
        raise ValueError("Invalid uploaded image format.")
    img2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    
    # Resize img2 to match img1 dimensions
    img2 = cv2.resize(img2, (img1.shape[1], img1.shape[0]))
    
    # Compute SSIM
    score, _ = ssim(img1, img2, full=True)
    return score * 100

@app.post("/api/compare")
async def compare_image(
    team_name: str = Form(...),
    event_name: str = Form(...),
    category: str = Form(...),
    file: UploadFile = File(...)
):    
    if category not in PREDEFINED_IMAGES:
        return {"error": "Invalid category"}
        
    img_bytes = await file.read()
    
    import re
    safe_team_name = re.sub(r'[^A-Za-z0-9_\-]', '_', team_name)
    filename = f"{safe_team_name}_{category}.png"
    upload_path = os.path.join(UPLOADS_DIR, filename)
    with open(upload_path, "wb") as f:
        f.write(img_bytes)
    
    try:
        score = compare_images(PREDEFINED_IMAGES[category], img_bytes)
        score = float(max(0, min(100, score))) # Clamped exactness
    except ValueError as e:
        # Failsafe if image corruption or completely mismatched
        return {"error": str(e)}
    except Exception as e:
        return {"error": f"Comparison failed: {str(e)}"}
    
    # Save to Excel
    try:
        df = pd.read_excel(EXCEL_FILE)
        
        new_row = {
            "Team Name": team_name,
            "Event Name": event_name,
            "Category": category,
            "Similarity Percentage": round(score, 2),
            "Uploaded Image Path": upload_path
        }
        
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        
        # Sort logically
        if "Similarity Percentage" in df.columns:
            df = df.sort_values(by=["Similarity Percentage"], ascending=[False])
        
        df.to_excel(EXCEL_FILE, index=False)
    except PermissionError:
        return {"error": "Excel file is currently open in another program. Please close it and try again."}
    except Exception as e:
        return {"error": f"Failed to save results: {str(e)}"}
        
    return {
        "similarity": round(score, 2)
    }

@app.get("/api/round2")
async def get_round2():
    # If we already generated assignments, return them
    if os.path.exists(ROUND2_FILE):
        return pd.read_excel(ROUND2_FILE).to_dict(orient="records")

    if not os.path.exists(EXCEL_FILE):
        return []

    df = pd.read_excel(EXCEL_FILE)
    if df.empty:
        return []

    # Get average similarity per team
    avg_scores = df.groupby("Team Name")["Similarity Percentage"].mean().reset_index()
    avg_scores = avg_scores.sort_values(by="Similarity Percentage", ascending=False)

    # Top 50%
    num_teams = len(avg_scores)
    top_n = max(1, int(np.ceil(num_teams / 2.0)))
    top_teams = avg_scores.head(top_n)["Team Name"].tolist()

    # Assign random distinct topics
    random.shuffle(TOPICS)
    
    assignments = []
    for i, team in enumerate(top_teams):
        topic = TOPICS[i % len(TOPICS)] # Safe fallback if more than 20 teams
        assignments.append({
            "Team Name": team,
            "Topic": topic
        })

    # Save assignments
    res_df = pd.DataFrame(assignments)
    res_df.to_excel(ROUND2_FILE, index=False)
    
    return assignments

@app.get("/api/download-excel")
async def download_excel():
    return FileResponse(EXCEL_FILE, filename="comparisons.xlsx", media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    
@app.get("/api/predefined/{category}")
async def get_predefined_image(category: str):
    if category in PREDEFINED_IMAGES:
        return FileResponse(PREDEFINED_IMAGES[category])
    return {"error": "Not found"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
