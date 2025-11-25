# FarmLive Deployment Guide

## 🚀 Vercel Deployment

This application is configured for automatic deployment on Vercel with serverless Python functions for crop disease prediction.

### Prerequisites
- Vercel account
- GitHub repository

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Setup Vercel deployment with serverless API"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration from `vercel.json`

3. **Configure Environment Variables** (if needed)
   - Add any API keys or environment variables in Vercel dashboard
   - Example: `GEMINI_API_KEY`, `MONGODB_URI`, etc.

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - The Python serverless functions will be automatically deployed

### How It Works

#### Frontend
- Built with Vite + React + TypeScript
- Deployed as static files from the `dist` directory
- Automatically built during deployment

#### Backend API
- Python serverless functions in `/api` directory
- `/api/predict` - Crop disease prediction endpoint
- `/api/health` - Health check endpoint
- TensorFlow model loaded on-demand for predictions

#### Model File
- The `best_phase2.weights.h5` file (228MB) is included in the deployment
- Model is loaded automatically when prediction requests are made
- No manual Python server management needed

### Local Development

Run both frontend and backend concurrently:

```bash
# Install dependencies
npm install

# Run both frontend and backend
npm run dev:all
```

Or run them separately:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

### API Endpoints

When deployed on Vercel:
- Frontend: `https://your-app.vercel.app`
- API Health: `https://your-app.vercel.app/api/health`
- API Predict: `https://your-app.vercel.app/api/predict` (POST with image)

### Important Notes

1. **Model Size**: The model file is ~228MB. Vercel supports this size.
2. **Cold Starts**: First request may be slower as the model loads
3. **Automatic Scaling**: Vercel automatically scales based on traffic
4. **No Server Management**: Everything runs serverlessly

### Troubleshooting

If you encounter issues:

1. **Model not loading**: Check Vercel logs for Python errors
2. **Build failures**: Ensure `requirements.txt` has correct versions
3. **API not responding**: Verify `/api` directory structure
4. **Large file errors**: Model file should be committed to git

### Alternative: Manual Python Server

If you prefer running a traditional Flask server:

```bash
python app.py
```

This runs on `http://localhost:5000` but is NOT suitable for Vercel deployment.
