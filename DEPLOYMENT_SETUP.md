# Deployment Setup Guide

## Vercel Deployment Instructions

Your project is configured to deploy to Vercel with:
- **Frontend**: Vite + React (deployed as static site)
- **Backend**: Express.js (deployed as serverless function)

### Prerequisites

1. Push your code to GitHub/GitLab/Bitbucket
2. Create a Vercel account at https://vercel.com

### Steps to Deploy

1. **Connect your repository to Vercel**
   - Go to https://vercel.com/new
   - Select your Git provider and import the repository
   - Choose "VisionShop" or your project name

2. **Configure Environment Variables in Vercel**
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables for **Production**:
     - `MONGODB_URI`: Your MongoDB connection string
     - `GEMINI_API_KEY`: Your Gemini API key
     - `NODE_ENV`: `production`
     - `API_BASE_URL`: Will be auto-generated (e.g., `https://your-project.vercel.app/api`)

3. **Deploy**
   - Click "Deploy" in Vercel
   - Wait for the build to complete

### Important Notes

⚠️ **Never commit `.env` files to Git!**

- `.env.example` shows the required variables (safe to commit)
- `.env` contains secrets and should be in `.gitignore`
- Add environment variables only in Vercel's dashboard

### Project Structure

```
vercel.json          # Multi-service configuration
package.json         # Root build scripts
backend/
  index.js           # Express server entry point
  package.json       # Backend dependencies
  .env               # Local env variables (don't commit)
  .env.example       # Template for env variables
frontend/
  vite.config.ts     # Frontend build configuration
  package.json       # Frontend dependencies
```

### Troubleshooting

**Build fails during deployment?**
- Check that `npm run build` works locally
- Verify all environment variables are set in Vercel
- Check build logs in Vercel dashboard

**API requests failing in production?**
- Ensure `API_BASE_URL` is correctly configured
- Check CORS settings in backend/index.js
- Verify MongoDB connection string is valid for production

**Frontend not loading?**
- Clear browser cache
- Check that frontend build outputs to `dist/` directory
- Verify routes in vercel.json
