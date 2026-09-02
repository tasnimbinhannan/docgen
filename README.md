# ⚡ DocuGen Pro — Document & Ticket Generation Web Application

> A modern, client-side web application for generating tickets, certificates, and invoices with real-time live preview, Supabase cloud database persistence, and secure public sharing links. Built in accordance with **SRS-DGA-001**.

---

## ✨ Features (Aligned with SRS-DGA-001)

### 🎟️ 1. Form-Based Document Generation (FR-1.1 – FR-1.9)
- **Multi-Template Support**:
  - **VIP & Event Pass Tickets**: Attendee name, seat/tier, venue, date/time, QR code & barcode simulation, security watermark.
  - **Certificate of Achievement / Completion**: Recipient name, course/achievement, issuing authority, gold seal, signatures, credential ID.
  - **Official Invoices / Receipts**: Client details, itemized table, tax rates, grand total calculation, paid verification stamp.
- **Real-Time Live Preview**: Instant visual rendering updates as the administrator types.
- **Client & Field Validation**: Visual highlights and inline error indicators on missing mandatory fields.
- **Cryptographic Security**: Automatic generation of human-readable reference IDs (e.g. `TCK-2026-X8K92`) and unguessable UUID public tokens.
- **Instant Generation Modal**: 1-click URL copying, public link preview, and instant PDF download.

### 📊 2. Admin Document Tracking Dashboard (FR-2.1 – FR-2.8)
- **Centralized Ledger**: View all issued documents ordered with the latest first.
- **Live Search & Filters**: Search in real-time by reference number, recipient name, or document title; filter by document category and date range.
- **One-Click Share**: Fast copy-to-clipboard public link with toast feedback.
- **Direct PDF Export**: Client-side high-resolution PDF rendering via `html2canvas` & `jsPDF`.
- **Responsive Pagination & Empty States**: Clean data viewing across desktop and mobile.

### 🔒 3. Standalone Public Document Portal (FR-3.1 – FR-3.6)
- **Zero-Authentication Public Links**: `public.html?token=<uuid>` reachable by recipients without signing in.
- **Strict Data Isolation**: Exposes only the single requested document with zero admin navigation or unauthorized data.
- **Export Capabilities**: High-res PDF download and direct browser printing.
- **Graceful 404 Handling**: Informative "Document Not Found / Expired" screen for invalid tokens.
- **Mobile-First Responsive Layout**: Crisp scaling from 360px mobile viewports to 4K displays.

### 🔐 4. Access Control & Security (FR-4.1 – FR-4.3)
- Admin sign-in screen with Supabase Email/Password authentication.
- Automatic route protection redirecting unauthenticated users to login.
- Inactivity session timeout (auto-logout after 30 minutes of idle time).

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (CSS Variables, Flexbox/Grid, Glassmorphism, Print Media Styles), Vanilla JavaScript (ES6+ Modules).
- **Database & Auth**: [Supabase](https://supabase.com) (PostgreSQL with Row Level Security + Supabase Auth).
- **Export Engine**: `html2canvas` and `jsPDF` for client-side PDF document generation.
- **Design System**: Google Fonts (*Outfit*, *Inter*, *Playfair Display*), dark/light theme switcher.

---

## 🚀 Getting Started

### Option A: Instant Local Test (Demo Mode)
1. Clone or open the repository.
2. Open `index.html` in any web browser (or serve via Live Server / Python `python -m http.server 8000`).
3. Click **"Sign In to Workspace"** (in demo mode, sign in with any valid password).
4. Start generating tickets and documents immediately!

### Option B: Connect to Remote Supabase Database
Follow the full step-by-step guide in [SETUP_GUIDE.md](SETUP_GUIDE.md) to set up your free Supabase PostgreSQL database in under 3 minutes.

---

## 🛡️ GitHub Safety & Publishing Guidelines

This project is built from the ground up for safe publication to public GitHub repositories:

1. **Client-Safe Anon Key**: Supabase uses an `ANON_KEY` combined with PostgreSQL **Row Level Security (RLS)**. Only authenticated administrators can insert or list documents; public visitors can only query single records matching their exact public token.
2. **Git Ignored Configuration**: `js/config.js` and `.env` files are specified in `.gitignore`. A safe `config.example.js` is provided as a reference.
3. **In-App Dynamic Setup**: You can enter your Supabase URL & Anon Key directly via the **⚙️ Supabase Settings** modal in the UI. Keys entered through the UI are saved exclusively in your browser's private `localStorage` and will never be committed to Git.
4. **Deploying on GitHub Pages**:
   - Push your code to your GitHub repository.
   - Go to **Settings ➔ Pages ➔ Source: Deploy from branch `main` / `root`**.
   - Open your GitHub Pages URL, click **"Supabase Settings"**, paste your Supabase URL & Anon Key, and your app is live!

---

## 📁 Project Structure

```
├── .gitignore                      # Git ignore rules for secrets
├── README.md                       # Main project documentation
├── SETUP_GUIDE.md                  # Supabase database setup guide
├── config.example.js               # Safe configuration template
├── index.html                      # Main App Shell (Login, Generator, Dashboard)
├── public.html                     # Standalone public document viewer
├── css/
│   ├── main.css                    # Design system, theme tokens, animations
│   ├── components.css              # Modals, toasts, tables, forms, buttons
│   ├── document-templates.css      # High-fidelity Tickets, Certs & Receipts
│   └── print.css                   # Print & PDF export optimizations
├── js/
│   ├── config.js                   # Active configuration & storage engine
│   ├── supabaseClient.js           # Supabase SDK wrapper with demo fallback
│   ├── auth.js                     # Admin auth & session inactivity timeout
│   ├── documents.js                # Document generator & live preview logic
│   ├── dashboard.js                # Tracker dashboard, search, filters
│   ├── publicView.js               # Public viewer & token resolution
│   ├── export.js                   # Client-side PDF exporter
│   └── ui.js                       # Toasts, modals, tabs, theme toggle
└── supabase/
    └── schema.sql                  # PostgreSQL table, indexes & RLS policies
```

---

## 📄 License
MIT License. Free to use and customize.
