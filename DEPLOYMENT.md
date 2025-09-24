# AI Chat Deployment Guide (Vercel)

This guide provides specific instructions for deploying the AI Chat feature, which relies on a Vercel serverless function.

## Prerequisites

1.  A [Vercel](https://vercel.com/) account.
2.  A [GitHub](https://github.com/), [GitLab](https://gitlab.com/), or [Bitbucket](https://bitbucket.org/) account.
3.  A Google AI API Key from [Google AI Studio](https://aistudio.google.com/).

## Step-by-Step Deployment

### 1. Fork and Clone the Repository

Fork this repository to your own Git account and then clone it to your local machine.

### 2. Push to Your Git Provider

Push the repository to your own GitHub, GitLab, or Bitbucket account.

### 3. Create a New Vercel Project

- Log in to your Vercel dashboard.
- Click the "Add New..." button and select "Project".
- Import the Git repository you just pushed.

### 4. Configure the Project

- **Framework Preset:** Vercel should automatically detect that this is a project with no specific framework. If not, select "Other".
- **Build & Development Settings:** You can leave these as default. The `api` directory will be automatically recognized for serverless functions.
- **Environment Variables:** This is the most important step.
    - Navigate to the "Settings" tab of your newly created project.
    - Click on "Environment Variables" in the left sidebar.
    - Add a new variable:
        - **Name:** `GOOGLE_AI_API_KEY`
        - **Value:** Paste your Google AI API key here.
    - Ensure the variable is available to all environments (Production, Preview, and Development).

### 5. Deploy

- After configuring the environment variable, navigate to the "Deployments" tab.
- Trigger a new deployment. You can do this by pushing a new commit to your repository or by manually redeploying the latest commit from the Vercel dashboard.
- Vercel will build and deploy your site. The serverless function in `api/chat.js` will now have access to the `GOOGLE_AI_API_KEY` you provided.

### 6. Verify

Once the deployment is complete, visit your Vercel URL and navigate to the `/chat.html` page. The AI chat should be fully functional. If you encounter errors, check the function logs in the Vercel dashboard for more details.