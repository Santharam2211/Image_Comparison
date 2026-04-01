# Image Comparison App ⚡📷

A full-stack image comparison web application built with React (Vite) and Python (FastAPI).

## Core Functionality Built:
- **Home Page**: Features a clean UI to input Team Name, Event Name, and upload a dynamic Custom Logo. Contains an integrated animated Stopwatch feature.
- **Comparison Page**: Dynamically renders 3 interactive cards (ClothShop, Foodie, Musicify) featuring distinct reference images.
- **Image Upload & Analytics**: Users can upload their own images to be compared in real-time securely mapped against predefined targets.
- **High-Precision Checking**: Uses `OpenCV` and Structural Similarity Index (SSIM) `scikit-image` for pixel-perfect similarity detection, generating similarity %.
- **Excel Spreadsheet Handling**: Server-side Excel generation logs tracking metadata (Team Name, timestamp logic, precision similarity, fast computational processing time taken), dynamically sorted for rapid leaderboard review.

## Tech Stack
- Frontend: React (Vite), Axios, modern CSS3 with Glassmorphism
- Backend: Python 3, FastAPI, OpenCV, Uvicorn, Pandas, scikit-image

## How to Run
## Setup & Installation
Clone the repository using git clone <your-repository-link> and navigate into the project folder using cd project-folder.
Create a virtual environment by running python -m venv venv to isolate project dependencies.
Activate the virtual environment: on Windows use venv\Scripts\activate, and on Mac/Linux use source venv/bin/activate.
Install all required dependencies using pip install -r requirements.txt, which will automatically install FastAPI, OpenCV, and other libraries.
Run the backend by navigating to the backend folder using cd backend and executing python main.py, which will start the server at http://localhost:8000
.
Open a new terminal, navigate to the frontend folder using cd frontend, install dependencies using npm install, and start the frontend using npm run dev, which will run at http://localhost:5173
.
Note that the venv folder is not included in the repository, so each user must create their own environment locally.
Uploaded images will be stored in the backend/Images/ folder, while reference images for comparison should be placed in the backend/assets/ folder.

