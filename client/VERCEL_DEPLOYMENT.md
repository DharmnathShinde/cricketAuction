# Vercel Deployment Guide

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your frontend code ready in the `client` directory

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**

   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Your Repository**

   - Connect your GitHub/GitLab/Bitbucket account
   - Select your repository
   - Click "Import"

3. **Configure Project Settings**

   - **Root Directory**: Set to `client` (since your frontend is in the client folder)
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `build` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Set Environment Variables**

   - Go to "Environment Variables" section
   - Add the following:
     - **Name**: `VITE_API_URL`
     - **Value**: `http://localhost:8080`
     - **Environment**: Production, Preview, Development (select all)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at a URL like `your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Navigate to Client Directory**

   ```bash
   cd cricketAuction/client
   ```

3. **Login to Vercel**

   ```bash
   vercel login
   ```

4. **Deploy**

   ```bash
   vercel
   ```

   - Follow the prompts
   - When asked for environment variables, add:
     - `VITE_API_URL=http://localhost:8080 `

5. **For Production Deployment**
   ```bash
   vercel --prod
   ```

## Important Notes

- **Root Directory**: Make sure Vercel knows your frontend is in the `client` folder
- **Environment Variables**: The `VITE_API_URL` must be set in Vercel's dashboard for the Railway backend to work
- **CORS**: Ensure your Railway backend allows requests from your Vercel domain

## After Deployment

1. Check your Vercel deployment URL
2. Test the connection to your Railway backend
3. Update CORS settings on Railway backend if needed to allow your Vercel domain
