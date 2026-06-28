# EWU Find Hub — Lost & Found Platform (Client)

EWU Find Hub is a campus lost-and-found web application. Students can post items they've lost or found, browse and search the listings, submit claims to recover an item, and track items that have been successfully returned. This repository contains the **client-side application** — a React single-page app that talks to a separate Express/MongoDB backend.

**Backend repository:** https://github.com/Hrikesh145/ewu-find-hub-server

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [User Roles](#user-roles)
- [Related Repository](#related-repository)

---

## Overview

EWU Find Hub gives students a central place to report and recover lost belongings on campus, instead of relying on physical notice boards or word of mouth. Two kinds of users interact with the app:

- **Students** (regular users), who post lost/found items, browse and search listings, submit a claim on an item, and track their own posts, claims, and recovered items.
- **Admins**, who review submitted claims, approve or reject them, and manage item status (e.g. marking an item as returned).

Authentication is handled by Firebase, while role checks (admin-only actions) are enforced on the backend using the Firebase ID token sent with each request.

## Features

- Email/password authentication via Firebase
- Post a lost or found item with details, photo, and location
- Search and filter items by type (lost/found) and status
- View full item details and submit a claim to recover it
- Track personal posts ("Manage My Items") and edit or remove them
- Track personal claims and recovered items
- Admin dashboard to review, approve, or reject claims
- Approved/returned items automatically move into a public "All Recovered" log
- Protected and admin-only routes that redirect unauthorized users
- Toast notifications and confirmation dialogs (via `react-hot-toast`, `react-toastify`, and `sweetalert2`)
- Date picking for item posting (`react-datepicker`) and image carousels (`swiper`)

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 + DaisyUI |
| Server state / caching | TanStack Query (React Query) |
| Forms | React Hook Form |
| HTTP client | Axios (with a Firebase-token-attached secure instance) |
| Authentication | Firebase Authentication |
| Icons | React Icons |
| Carousel | Swiper |
| Date picking | React Datepicker |
| Notifications | React Hot Toast, React Toastify, SweetAlert2 |
| Linting | ESLint |

## Project Structure

```
src/
├── components/
│   └── Shared/             # Navbar, Footer, Logo — used across layouts
├── contexts/
│   └── AuthContext/        # Firebase auth context + provider
├── firebase.init.js        # Firebase app initialization
├── hooks/
│   ├── useAuth.jsx         # Access auth context
│   ├── useAdmin.jsx        # Checks if the current user has the "admin" role
│   ├── useAxios.jsx        # Plain axios instance (public requests)
│   └── useAxiosSecure.jsx  # Axios instance with Firebase token attached
├── layouts/
│   ├── RootLayout/         # Public site layout (navbar + footer)
│   └── AuthLayout/         # Login / register layout
├── pages/
│   ├── Home/                  # Banner, latest finds, info sections
│   ├── AllItems/               # Browse / search all posted items
│   ├── ViewDetails/             # Single item detail + claim
│   ├── AddItems/                # Post a lost or found item
│   ├── ManageMyItems/            # Edit / delete your own posts
│   ├── UpdateItems/              # Edit an existing item
│   ├── AllRecovered/            # Public log of recovered items
│   ├── AdminItems/               # Admin: manage items & claims
│   ├── Center/                  # Info about the physical lost & found center
│   ├── Authentication/          # Login, Register
│   └── NotFound/
├── router/
│   └── router.jsx          # Route definitions
├── routes/
│   ├── PrivateRoute.jsx    # Requires a logged-in user
│   └── AdminRoute.jsx      # Requires the "admin" role
└── main.jsx                 # App entry point
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A Firebase project (for Authentication)
- The [backend server](https://github.com/Hrikesh145/ewu-find-hub-server) running locally or deployed

### Installation

```bash
git clone https://github.com/Hrikesh145/ewu-find-hub-clint.git
cd ewu-find-hub-clint
npm install
```

Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below), then start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Environment Variables

Create a `.env.local` file with the following keys:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These values are available from your Firebase project settings (Project Settings → General → Your apps).

> The API base URL the client talks to is currently set directly inside `src/hooks/useAxios.jsx` and `src/hooks/useAxiosSecure.jsx`. Update these if you're pointing the client at a different backend instance (e.g. a local server).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Deployment

This project is configured for **Firebase Hosting**. After building, deploy with:

```bash
npm run build
firebase deploy
```

Hosting is configured in `firebase.json` to serve the `dist` folder and rewrite all routes to `index.html`, so client-side routing works correctly on refresh and direct links.

## User Roles

New users are created with a default role of `student`. Admins are assigned manually at the database level and can access the admin-only `Manage Items` route, where they review claims and update item status. Role checks are enforced both on the client (via `AdminRoute`) and on the server, where the Firebase ID token is verified on every protected request.

## Related Repository

This client application depends on the EWU Find Hub backend API:

- **Backend:** [ewu-find-hub-server](https://github.com/Hrikesh145/ewu-find-hub-server) — Express, MongoDB, and Firebase Admin SDK, deployed on Vercel.

The backend exposes REST endpoints for users, items, claims, and recovered items, and verifies all protected requests using the Firebase ID token sent from this client.