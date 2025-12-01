# Content Manager Web App

A minimal Flask web application for adding and displaying content.

## Features
- Add content with title and description
- Display all content in a clean interface
- API endpoint to fetch content as JSON
- Gray-themed responsive design

## Local Development
```bash
pip install -r requirements.txt
python app.py
```

## Render Deployment
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use these settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Environment: Python 3

## API Endpoints
- `GET /` - Redirects to add content page
- `GET /add` - Add content form
- `POST /add` - Submit new content
- `GET /display` - View all content
- `GET /api/content` - JSON API for content