<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20,27&height=220&section=header&text=%F0%9F%8C%8D%20RealState%20Marketplace&fontSize=42&fontAlignY=38&desc=Full-Stack%20Vacation%20Rental%20%26%20Property%20Booking%20Platform&descAlignY=60&descAlign=50" width="100%" alt="RealState Marketplace Banner" />

  <p align="center">
    <strong>A production-ready full-stack web application inspired by Airbnb, empowering travelers to discover, list, review, and navigate accommodations worldwide.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Node.js-24.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/EJS_Mate-Templating-B4CA65?style=for-the-badge&logo=ejs&logoColor=black" alt="EJS" />
    <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
    <img src="https://img.shields.io/badge/Cloudinary-Media%20CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
    <img src="https://img.shields.io/badge/MapTiler-Geocoding%20%26%20Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white" alt="MapTiler" />
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-system-architecture">System Architecture</a> •
    <a href="#-database-schema">Database Schema</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api--routes-reference">Route Endpoints</a>
  </p>

</div>

---

## 📖 Overview

**RealState Marketplace** (Wanderlust) is an end-to-end full-stack web application designed and built using the **MVC (Model-View-Controller)** architectural pattern. It replicates core functionalities of modern travel and lodging marketplaces like Airbnb. 

The application offers a smooth user experience for both guests and property hosts:
- **Guests** can search listings by location, explore interactive pinpoints on geospatial maps, read community ratings, and leave verified reviews.
- **Hosts** can register, publish new property listings with high-resolution image uploads stored on the Cloudinary CDN, edit property rates and descriptions, and manage reviews with strict ownership-based authorization.

---

## 🚀 Key Features

### 🏡 1. Complete Listings Management (CRUD)
- Create, Read, Update, and Delete properties with real-time feedback.
- Format prices automatically with Indian currency notation (`₹ / night`).
- Upload high-resolution cover photos with automatic cloud storage transformation.

### 🗺️ 2. Forward Geocoding & Interactive Maps
- Powered by **MapTiler Geocoding API** and **MapLibre GL**.
- Forward geocodes text addresses (e.g. *"Goa, India"*) into GeoJSON `Point` coordinates (`[longitude, latitude]`) upon creation.
- Renders dynamic interactive maps with pinpoint markers and location badges on listing detail views.

### 🔐 3. Authentication & Granular Access Control
- Session-based authentication via **Passport.js** and **Passport-Local-Mongoose** with password salting and hashing.
- Route protection middleware (`isLoggedIn`) preserves return URLs (`req.session.redirectUrl`) for post-login redirection.
- Ownership checks (`isOwner`, `isReviewAuthor`) ensure users cannot modify or delete content they do not own.

### ⭐ 4. Interactive Review & Rating Engine
- Integrated 1–5 star interactive rating widgets (`rating.css`) and comment threads.
- Mongoose `findOneAndDelete` post-hook ensures **cascade deletion**—removing a listing automatically clears all associated reviews from the database.

### 🔍 5. Real-Time Destination Search
- Instant case-insensitive regex query engine across `title`, `location`, and `country`.
- Dedicated search results view with friendly fallbacks when no matches are found.

### 🛡️ 6. Multi-Layer Validation & Error Handling
- **Server-Side:** Strict schema verification using **Joi** schemas for listings and reviews.
- **Client-Side:** Form validation powered by Bootstrap 5 with custom feedback states.
- **Async Safety:** Custom `wrapAsync` wrapper and `ExpressError` class for centralized error logging.

---

## 🏗️ System Architecture

The application follows the classic **Model-View-Controller (MVC)** architectural design:

```
                  ┌───────────────────────────────┐
                  │          HTTP Client          │
                  │   (Browser / EJS Views)       │
                  └───────────────┬───────────────┘
                                  │  HTTP Requests
                                  ▼
                  ┌───────────────────────────────┐
                  │       Express 5 Router        │
                  │  (Routes + Custom Middleware) │
                  └───────┬───────────────┬───────┘
                          │               │
        Multer / Auth     │               │  Validated Req
                          ▼               ▼
           ┌─────────────────────┐  ┌─────────────────────┐
           │ Cloudinary Storage  │  │     Controllers     │
           │  & MapTiler Client  │  │  (Business Logic)   │
           └─────────────────────┘  └──────────┬──────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │   Mongoose Models   │
                                    │ (Listing/Review/User│
                                    └──────────┬──────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │  MongoDB Atlas DB   │
                                    └─────────────────────┘
```

---

## 🗄️ Database Schema & Data Modeling

The database uses a referenced **One-to-Many (`1 : N`)** schema relationship:

```
        ┌────────────────────────────────────────────────────────┐
        │                         User                           │
        │  _id, username, email, hash, salt                      │
        └───────────────┬────────────────────────┬───────────────┘
                        │ 1                      │ 1
                        │                        │
                        ▼ N (owns)               ▼ N (writes)
        ┌──────────────────────────────┐ 1      ┌──────────────────────────────┐
        │           Listing            │───────►│            Review            │
        │  _id, title, description,    │        │  _id, comment, rating,       │
        │  price, location, country,   │        │  author (Ref -> User),       │
        │  image: { url, filename },   │        │  createdAt                   │
        │  geometry: { coordinates },  │        └──────────────────────────────┘
        │  owner (Ref -> User),        │ N
        │  reviews: [Ref -> Review]    │
        └──────────────────────────────┘
```

---

## 📁 Project Structure

```
majorproject/
├── controllers/              # Route controller logic (MVC Pattern)
│   ├── listings.js           # CRUD & search handlers for listings
│   ├── reviews.js            # Review creation and deletion handlers
│   └── users.js              # Authentication (signup, login, logout)
├── init/                     # Database initialization and mock datasets
│   ├── data.js               # Sample listing data
│   └── index.js              # Database seed script
├── models/                   # Mongoose Data Models
│   ├── listing.js            # Listing schema + cascade delete hook
│   ├── review.js             # Review schema
│   └── user.js               # User schema with Passport-Local-Mongoose
├── public/                   # Static client assets
│   ├── css/                  # Custom styles & rating widgets
│   │   ├── rating.css        # Star rating styling
│   │   └── style.css         # Custom card, layout, and utility CSS
│   └── js/                   # Client scripts
│       ├── map.js            # MapLibre GL map initialization
│       └── script.js         # Form validation handlers
├── routes/                   # Express modular route definitions
│   ├── listing.js            # /listings routes
│   ├── review.js             # /listings/:id/reviews routes
│   └── user.js               # /signup, /login, /logout routes
├── utils/                    # Error handling utilities
│   ├── ExpressError.js       # Custom error class
│   └── wrapAsync.js          # Async wrapper utility
├── views/                    # EJS dynamic UI templates
│   ├── includes/             # Shared partials (navbar, footer, flash alerts)
│   ├── layouts/              # Boilerplate layout wrapper (boilerplate.ejs)
│   ├── listings/             # Listing views (index, show, new, edit, location)
│   └── users/                # Authentication views (login, signup)
├── .env                      # Environment variable configurations (gitignored)
├── .env.example              # Template for required environment variables
├── app.js                    # Application entry point & Express server configuration
├── cloudConfig.js            # Cloudinary & Multer storage configuration
├── middleware.js             # Authentication, authorization & validation middleware
├── package.json              # Project dependencies & scripts
└── schema.js                 # Joi schema definitions for server-side validation
```

---

## Live Demo: https://real-state-marketplace-auav.onrender.com/listings

## ⚙️ Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or v24.x recommended)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance
- [Cloudinary](https://cloudinary.com/) free developer account (for image uploads)
- [MapTiler](https://www.maptiler.com/) free account (for geocoding & maps)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/tusharyadav24/majorproject.git
cd majorproject
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Cloudinary Configuration
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# MapTiler API
MAPTILER_API_KEY=your_maptiler_api_key

# MongoDB Database Connection URL
ATLASDB_URL=your_mongodb_connection_string

# Session Secret Key
SECRET=your_super_secret_session_key

# Base URL (for development)
BASE_URL=http://localhost:8080


```

### Step 4: Seed Initial Data (Optional)

To populate the database with sample properties, run the seed script:

```bash
node init/index.js
```

### Step 5: Start the Server

```bash
node app.js
```

The application will start and listen on port `8080`. Open your browser and navigate to:
```
http://localhost:8080/listings
```

---

## 🔌 API & Routes Reference

### Listings Endpoints

| Method | Route | Description | Protection |
| :--- | :--- | :--- | :--- |
| `GET` | `/listings` | Display all property listings | Public |
| `GET` | `/listings/search?location=...` | Search listings by title, country, or location | Public |
| `GET` | `/listings/new` | Render form to create a new listing | Logged In |
| `POST` | `/listings` | Create a new listing (with image & geocoding) | Logged In, Validated |
| `GET` | `/listings/:id` | Display detailed view of a specific listing | Public |
| `GET` | `/listings/:id/edit` | Render edit form for a listing | Logged In, Owner Only |
| `PUT` | `/listings/:id` | Update listing details / replacement image | Logged In, Owner Only |
| `DELETE`| `/listings/:id` | Delete a listing and cascade-delete reviews | Logged In, Owner Only |

### Reviews Endpoints

| Method | Route | Description | Protection |
| :--- | :--- | :--- | :--- |
| `POST` | `/listings/:id/reviews` | Post a star rating and comment | Logged In, Validated |
| `DELETE`| `/listings/:id/reviews/:reviewId` | Delete a review | Logged In, Author Only |

### User & Authentication Endpoints

| Method | Route | Description | Protection |
| :--- | :--- | :--- | :--- |
| `GET` | `/signup` | Render user registration form | Public |
| `POST` | `/signup` | Register a new user account | Public |
| `GET` | `/login` | Render login form | Public |
| `POST` | `/login` | Authenticate user credentials & start session | Public |
| `GET` | `/logout` | Terminate session & log out | Logged In |

---

## 🛡️ Security & Performance Highlights

- **Session Security**: Session cookies are configured with `HttpOnly` flags, 7-day lifespans, and automated session pruning via `connect-mongo`.
- **Injection & Payload Protection**: Request bodies are strictly scrubbed through **Joi schemas** before hitting controller logic.
- **Cascade Deletion**: Automatic lifecycle cleanup prevents orphaned review records when properties are removed.
- **Cloud Delivery**: Media files are hosted on Cloudinary's multi-region CDN for fast asset delivery and reduced server memory footprint.

---

## 👨‍💻 Author

**Tushar Yadav**
- GitHub: [@tusharyadav24](https://github.com/tusharyadav24)
- LinkedIn: [Tushar Yadav](https://www.linkedin.com/in/tushar-yadav24/)
- Email: [krishnasinghyadav24@gmail.com](mailto:krishnasinghyadav24@gmail.com)
---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
