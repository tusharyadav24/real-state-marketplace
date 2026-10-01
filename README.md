# 🌍 RealState marketplace

it is a full-stack web application inspired by Airbnb, designed for travelers to discover, list, and review unique accommodations across the globe. Built with Node.js, Express, MongoDB, and EJS, the platform features session-based authentication, image hosting, interactive map displays, and full CRUD functionality.

---

## 🚀 Features

- **Authentication & Authorization**: Secure signup, login, and logout powered by Passport.js with password hashing and salting. Role-based permissions ensure only listing owners and review authors can edit or delete their content.
- **Listings Management (CRUD)**: Create, view, update, and delete property listings with detailed location info, pricing, and high-resolution images.
- **Interactive Review System**: Authenticated users can leave ratings (1–5 stars) and comments on properties. Cascade deletion removes associated reviews when a listing is deleted.
- **Image Uploads**: Media handling via Multer and integration with Cloudinary for cloud image storage.
- **Geocoding & Maps**: Integrated maps powered by MapTiler/Mapbox to display precise listing coordinates.
- **Form Validation & Security**: Server-side schema validation using Joi, client-side validation using Bootstrap, and flash messaging for user feedback.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend / Templating**: EJS, `ejs-mate` (layout boilerplate), Bootstrap 5, Custom CSS
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: Passport.js, `passport-local`, `passport-local-mongoose`, `express-session`
- **Cloud Storage**: Cloudinary, `multer-storage-cloudinary`, Multer
- **Validation**: Joi

---

## 🗄️ Database Architecture

The application implements a referenced One-to-Many (`1 : N`) schema pattern:

```text
               ┌──────────────────────┐
               │         User         │
               └──────────┬───────────┘
                          │
          ┌───────────────┴───────────────┐
  1 : N   │ (creates / owns)      1 : N   │ (writes)
          ▼                               ▼
┌───────────────────┐             ┌─────────────────┐
│      Listing      │─── 1 : N ──►│     Review      │
│ (contains reviews)│             │ (author: User)  │
└───────────────────┘             └─────────────────┘

📁 Project Structure

realstate marketplace/
├── controllers/          # Route handlers & business logic (MVC pattern)
├── init/                 # Sample data seed scripts
│   ├── data.js
│   └── index.js
├── models/               # Mongoose schemas (Listing, Review, User)
├── public/               # Static assets (CSS, client-side JS)
├── routes/               # Express route modules (listing, review, user)
├── utils/                # Custom error handlers & utility wrappers (ExpressError, wrapAsync)
├── views/                # EJS templates
│   ├── includes/         # Partials (navbar, footer, flash alerts)
│   ├── layouts/          # Boilerplate layout
│   ├── listings/         # Listing views (index, show, new, edit)
│   └── users/            # Auth views (login, signup)
├── .env.example
├── app.js                # Server entry point
├── middleware.js         # Custom auth & validation middleware
├── schema.js             # Joi validation schemas
└── package.json