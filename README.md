# Hafizabad Health Guide (حافظ آباد ہیلتھ گائیڈ)
> **“Hafizabad Ki Sehat, Ek Jagah”**
> *Official Public Healthcare Directory for Hafizabad District, Punjab, Pakistan*

---

## 🚀 GitHub Pages Deployment Guide (Why website was blank & How it is fixed)

### Why was the website not showing on GitHub Pages?
When deploying a Vite/React application to GitHub Pages (at `https://<username>.github.io/<repository-name>/`), two common issues cause a blank screen:
1. **Asset Path Issue**: By default, Vite looks for assets at the root domain (`/assets/...`) instead of the repository subfolder (`./assets/...`).
   * **Fix Applied**: `vite.config.ts` has been configured with `base: './'` so all script, stylesheet, and image paths are relative and work on any URL structure.
2. **SPA Subroute 404s**: When navigating or refreshing on subpages like `/find-doctor` or `/emergency-helplines`, GitHub Pages looks for physical `.html` files and gives a 404 error.
   * **Fix Applied**: `public/404.html` has been added to automatically redirect requests back to the Single Page Application router without crashing.

---

### How to Deploy to GitHub Pages (2 Easy Methods)

#### Method 1: Automatic GitHub Actions (Recommended)
1. Push this project to your GitHub repository:
   ```bash
   git add .
   git commit -m "Update GitHub Pages build configuration"
   git push origin main
   ```
2. In your GitHub repository:
   * Go to **Settings** → **Pages**
   * Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every time you push to `main`, GitHub will automatically build and deploy your site in ~1 minute.

#### Method 2: Deploying via `gh-pages` Branch
1. Build the production files:
   ```bash
   npm run build
   ```
2. The compiled static website is generated in the `dist` folder.
3. Push the contents of the `dist` folder to your `gh-pages` branch, or use the `gh-pages` tool:
   ```bash
   npx gh-pages -d dist
   ```
4. In GitHub: **Settings** → **Pages** → Source: Select `gh-pages` branch → `/ (root)` → Save.

---

## 🌟 Key Features

1. **Find a Doctor & Healthcare Service (`/find-doctor`)**:
   * Health concern and specialty matcher (e.g. eye problems, weak eyesight, children, heart, skin, bones, surgery, tests).
   * Search box: *“What type of doctor or healthcare service are you looking for?”*
   * Clear medical disclaimer emphasizing this is a service navigation tool, not a medical diagnosis tool.

2. **Dedicated Eye & Eyesight Care Section (`/eyecare`)**:
   * Verified facilities: Siddique Mughal Eye Hospital, DHQ Hospital Ophthalmology Ward, and private eye clinics.
   * Specialized filters: Phaco Cataract stitchless surgery, computerized vision testing, glasses assessment, glaucoma management, and pediatric squint care.

3. **Emergency Helplines Page (`/emergency-helplines`)**:
   * High-visibility 24/7 hotline cards with direct one-tap calling (`tel:`) and copy buttons.
   * Rescue 1122, Punjab Police 15, Fire Brigade 16, Edhi Ambulance 115, Hafizabad District Control Room (0547-920111), Directory Inquiry 1217.
   * Clear life safety notice and verification dates.

4. **District-Wide Verified Directory**:
   * **Hospitals (`/hospitals`)**: DHQ Hospital Hafizabad, THQ Pindi Bhattian, Trauma Center, and registered private surgical hospitals.
   * **Real-Time Blood Finder (`/blood`)**: Live availability across all 8 blood groups (A+, B+, O+, AB+, etc.) with mandatory call-ahead warnings.
   * **24/7 Pharmacies & Medical Stores (`/pharmacies`)**: Store hours, home delivery numbers, and cold-chain insulin verification.
   * **Diagnostic Laboratories (`/labs`)**: Chughtai Lab, IDC, Excel Labs, X-Ray, Ultrasound, and CT Scan centers.
   * **Interactive District Map (`/map`)**: Interactive markers and GPS directions.
   * **Hospital Comparison Tool (`/compare`)**: Side-by-side comparison of up to 4 medical centers.

5. **Bilingual Support (English & Urdu اردو)**:
   * Instant toggle between English and Urdu with proper right-to-left (RTL) formatting and Urdu typography.

---

## 🛠️ Local Development & Build

### Prerequisites
* Node.js (v18 or higher recommended)
* npm

### Install Dependencies
```bash
npm install
```

### Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Test Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml       # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── 404.html             # GitHub Pages SPA redirect handler
│   ├── favicon.svg          # Official district healthcare emblem favicon
│   ├── logo.svg             # Scalable official vector logo
│   ├── robots.txt           # SEO robots directives
│   └── sitemap.xml          # XML sitemap for search engines
├── src/
│   ├── components/          # Reusable UI components (Navbar, Footer, Modals, Logo)
│   ├── data/                # Factual district medical databases & initial data
│   ├── pages/               # Application view controllers
│   │   ├── FindDoctorPage.tsx       # Health concern matcher & eye care section
│   │   ├── EmergencyHelplinesPage.tsx # Emergency numbers & hotlines
│   │   ├── HomePage.tsx             # District portal homepage
│   │   ├── HospitalsPage.tsx        # Hospital directory
│   │   ├── DoctorsPage.tsx          # Doctor roster
│   │   ├── BloodBanksPage.tsx       # Blood stock inventory
│   │   ├── PharmaciesPage.tsx       # Pharmacy directory
│   │   ├── LabsPage.tsx             # Diagnostic centers
│   │   ├── MapPage.tsx              # Interactive map
│   │   ├── ComparePage.tsx          # Facility comparison tool
│   │   └── AdminPage.tsx            # Admin verification portal
│   ├── services/            # LocalStorage persistence & audit trail
│   ├── types.ts             # TypeScript domain definitions
│   └── translations.ts      # Bilingual English & Urdu dictionaries
├── index.html               # Web application entry point
├── package.json
├── vite.config.ts           # Vite bundler configuration (with base: './')
└── README.md
```

---

## ⚖️ Disclaimer
*Hafizabad Health Guide is an informational public healthcare directory. It is not an emergency dispatcher and does not provide medical diagnosis or treatment. In life-threatening emergencies, dial **1122** immediately.*
