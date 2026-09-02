# 📋 Complete Supabase Setup Guide for DocuGen

This guide walks you through connecting your **DocuGen** application to a free [Supabase](https://supabase.com) PostgreSQL database with strict **Row Level Security (RLS)**.

---

## 🔹 Step 1: Create a Free Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and click **"Sign In"** or **"Start your project"**.
2. Click **"New Project"**.
3. Choose your Organization, name your project (e.g. `docugen-app`), choose a strong Database Password, and select your nearest region.
4. Click **"Create new project"** (Supabase provisions the database in ~1 minute).

---

## 🔹 Step 2: Execute the Database Schema (SQL)

1. In your Supabase Project dashboard, click on **"SQL Editor"** (icon on the left sidebar: `>_`).
2. Click **"New query"**.
3. Open the file [`supabase/schema.sql`](supabase/schema.sql) in this repository and copy all its contents.
4. Paste the SQL script into the Supabase SQL Editor.
5. Click **"Run"** (or press `Ctrl + Enter`).
6. You will see `Success. No rows returned`.
7. Click on **"Table Editor"** on the left menu: you should now see the `documents` table with all columns and indexes created!

---

## 🔹 Step 3: Create an Admin Account in Supabase Auth

1. In the left sidebar, navigate to **"Authentication" ➔ "Users"**.
2. Click **"Add user" ➔ "Create user"**.
3. Enter an admin email (e.g., `admin@docugen.io`) and a secure password.
4. Set **"Auto Confirm User?"** to **Checked (Yes)**.
5. Click **"Create user"**.

---

## 🔹 Step 4: Retrieve Your API Credentials

1. In the left sidebar, click on **"Project Settings"** (⚙️ gear icon) ➔ **"API"**.
2. Locate the following two values:
   - **Project URL**: (e.g. `https://xyzprojectname.supabase.co`)
   - **Project API Keys ➔ `anon` `public`**: (e.g. `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...`)

> ⚠️ **Security Note**: The `anon` key is safe for client-side JavaScript because our PostgreSQL **Row Level Security (RLS)** policies in `schema.sql` restrict access so anonymous users can only query single records matching their exact `public_token`, while all write operations require admin authentication.

---

## 🔹 Step 5: Connect DocuGen to Supabase

You can connect DocuGen to your Supabase project in either of two ways:

### Method A: Connect Directly inside the Browser (Recommended for GitHub Pages)
1. Open `index.html` in your browser.
2. Click on the status pill in the top navbar: **"Supabase: Demo Mode"** (or click **"⚙️ Supabase Settings"**).
3. Paste your **Supabase Project URL** and **Anon Public Key**.
4. Click **"Save & Connect"**.
5. The top status pill will immediately switch to **🟢 Supabase: Connected**!
6. *Note*: This saves credentials in your browser's private `localStorage`, keeping your GitHub repository 100% clean and free of hardcoded keys.

### Method B: Configure in `js/config.js` (For Local Development)
1. In your local repository, create or open `js/config.js`.
2. Update the values:
   ```javascript
   window.APP_CONFIG = {
     SUPABASE_URL: "https://your-project-id.supabase.co",
     SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     APP_NAME: "DocuGen Pro"
   };
   ```
3. Because `js/config.js` is included in [`.gitignore`](.gitignore), it will never be accidentally committed to GitHub.

---

## 🔹 Step 6: Test Document Generation & Verification

1. On `index.html`, sign in with the admin email and password you created in Step 3.
2. Select **"🎟️ VIP / Event Ticket"** (or Certificate / Invoice), enter your details, and watch the live preview update.
3. Click **"⚡ Generate Document"**.
4. You will receive a success popup with the unique Reference ID (e.g., `TCK-2026-A8K92`) and a Public Share Link.
5. Click **"👁️ Open Public View"**: notice how the public document opens cleanly in `public.html?token=...` without requiring any login!
6. Click **"📥 Download PDF"** on either page to verify high-resolution client-side export.
7. Click the **"Document Tracker & Records"** tab in the admin workspace to see your newly generated record in the tracking table.

---

## 🔹 Step 7: Publishing to GitHub & Hosting

1. Initialize Git in your folder:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of DocuGen web application"
   ```
2. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/document-generation-web-app.git
   git branch -M main
   git push -u origin main
   ```
3. To host on **GitHub Pages**:
   - Go to your repository **Settings ➔ Pages**.
   - Under **Build and deployment**, set **Source** to **Deploy from a branch**.
   - Select Branch: `main`, Folder: `/ (root)`.
   - Click **Save**. Your app will be live on `https://<your-username>.github.io/<repo-name>/` in 60 seconds!
4. Open the hosted page and connect your Supabase project via the in-app **⚙️ Supabase Settings** modal.
