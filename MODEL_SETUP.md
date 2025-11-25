# Model File Setup for Deployment

## Important: Model File Not Included in Git

The crop disease prediction model file (`best_phase2.weights.h5`, ~228MB) is **NOT** included in this repository due to its large size.

## For Vercel Deployment

### Option 1: Upload Model to Cloud Storage (Recommended)

1. **Upload the model file to a cloud storage service:**
   - Google Cloud Storage
   - AWS S3
   - Azure Blob Storage
   - Or any CDN

2. **Update the API code** to download the model from the cloud URL on first use:

```python
import requests
import os

MODEL_URL = "https://your-storage-url/best_phase2.weights.h5"
MODEL_PATH = "/tmp/best_phase2.weights.h5"

def download_model():
    if not os.path.exists(MODEL_PATH):
        response = requests.get(MODEL_URL)
        with open(MODEL_PATH, 'wb') as f:
            f.write(response.content)
    return MODEL_PATH
```

### Option 2: Use Vercel Blob Storage

1. Install Vercel Blob SDK:
```bash
npm install @vercel/blob
```

2. Upload model file to Vercel Blob via CLI or dashboard

3. Update API to fetch from Vercel Blob

### Option 3: Use TensorFlow.js (Browser-based)

Convert the model to TensorFlow.js format and run predictions entirely in the browser:

```bash
pip install tensorflowjs
tensorflowjs_converter --input_format keras best_phase2.weights.h5 public/models/tfjs
```

Then use `@tensorflow/tfjs` (already in dependencies) to load and run the model in the browser.

## For Local Development

1. **Ensure you have the model file** in the project root:
   ```
   farm-smart-horizon/
   ├── best_phase2.weights.h5  (place here)
   └── public/
       └── models/
           └── best_phase2.weights.h5  (or here)
   ```

2. **Run both frontend and backend:**
   ```bash
   npm run dev:all
   ```

## Model File Location

You need to obtain the `best_phase2.weights.h5` file and place it in:
- Root directory: `best_phase2.weights.h5`
- OR Public directory: `public/models/best_phase2.weights.h5`

## Alternative: Disable Prediction Feature

If you want to deploy without the prediction feature:

1. Comment out the prediction routes in `api/predict.py`
2. Update the frontend to hide/disable the crop disease prediction feature
3. Deploy without the model file

## Recommended Approach for Production

For the best production experience:

1. **Convert to TensorFlow.js** and run predictions in the browser
2. This eliminates the need for a Python backend for predictions
3. Reduces server costs and improves scalability
4. Model loads once in the user's browser

See `DEPLOYMENT.md` for full deployment instructions.
