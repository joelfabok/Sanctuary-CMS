# Sanctuary Builder

**Professional website builder for churches, ministries, missionaries, and nonprofits.**

Built with: React (Vite) · Node.js / Express · MongoDB (Mongoose) · JWT Auth

---

## Project Structure

```
sanctuary-builder/
├── server/                  # Express API
│   ├── index.js             # Entry point
│   ├── middleware/
│   │   └── auth.js          # JWT protect + adminOnly guards
│   ├── models/
│   │   ├── User.js          # User schema (bcrypt hashed passwords)
│   │   ├── Organization.js  # Org schema (plan, billing, members)
│   │   ├── Site.js          # Full page/nav/element schema
│   │   └── Homepage.js      # CMS data for landing page
│   ├── routes/
│   │   ├── auth.js          # register, login, /me, change-password
│   │   ├── users.js         # profile update, invite member, remove member
│   │   ├── orgs.js          # org CRUD, billing update
│   │   ├── sites.js         # site CRUD (scoped to org)
│   │   ├── admin.js         # admin: stats, orgs, users, recovery, sub mgmt
│   │   └── homepage.js      # public GET + admin PUT for CMS
│   └── seed/
│       └── seed.js          # Seeds demo data into MongoDB
│
└── client/                  # React + Vite frontend
    ├── src/
    │   ├── App.jsx           # Router + ProtectedRoute
    │   ├── index.css         # Global CSS design system
    │   ├── main.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # user, org, login, logout, register
    │   ├── utils/
    │   │   └── api.js           # Axios instance with JWT interceptor
    │   ├── data/
    │   │   └── constants.jsx    # PLANS, PALETTES, TEMPLATES, NAVBAR_STYLES, EL_TYPES
    │   ├── pages/
    │   │   ├── Landing.jsx      # Public homepage (fetches CMS data)
    │   │   ├── Pricing.jsx      # Plan comparison page
    │   │   ├── Auth.jsx         # Login + Register
    │   │   ├── Dashboard.jsx    # Site management dashboard
    │   │   ├── Builder.jsx      # Full drag-drop site builder
    │   │   ├── Settings.jsx     # Profile, billing, team, org
    │   │   └── Admin.jsx        # Platform admin dashboard
    │   └── components/
    │       ├── builder/
    │       │   ├── PropPanel.jsx   # Right panel (element/row/navbar props)
    │       │   ├── REl.jsx         # Element renderer (11 element types)
    │       │   └── StylesTab.jsx   # Color palettes + custom colors
    │       └── shared/
    │           └── UI.jsx          # Modal, PSec, SL, CP, Seg, AlBtns, Logo
    └── vite.config.js       # Proxy /api → localhost:5000
```

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas connection string

### 2. Install dependencies

```bash
# Root (server deps)
npm install

# Client deps
cd client && npm install && cd ..
```

### 3. Environment variables

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

Default `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/sanctuary-builder
JWT_SECRET=sanctuary_super_secret_jwt_key_change_in_production
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the database

```bash
npm run seed
```

This creates demo users, organizations, and homepage CMS data.

**Demo credentials after seeding:**

| Role  | Email                        | Password   |
|-------|------------------------------|------------|
| Admin | admin@sanctuary.build        | admin123   |
| User  | pastor@gracechurch.org       | demo123    |
| User  | admin@missionignite.org      | demo123    |

### 5. Run in development

```bash
npm run dev
```

This starts both the Express server (port 5000) and Vite dev server (port 5173) concurrently.

Open → **http://localhost:5173**

---

## Features

### Public (no account needed)
- Landing page with live CMS content from database
- Full template previews — browse and preview all 5 templates free
- Pricing page with plan comparison
- Register / Login

### User Dashboard
- Create, edit, publish, delete websites (up to plan limit)
- 5 professional templates: Grace Church, Global Reach (Missionary), Hope Outreach (Nonprofit), Arise Church, Simple Start
- Full drag-and-drop website builder
  - 11 element types: heading, text, button, image, divider, spacer, list, quote, badge, feature, event
  - 4 navbar styles: Classic, Centered, Minimal, Bold Split
  - 8 color palettes + custom color editor
  - Undo/redo (40 steps), keyboard shortcuts
  - Desktop / Tablet / Mobile viewport preview
  - Publish to live
- Team management (invite members, set roles)
- Billing & plan management
- Organization settings

### Admin Dashboard (`/admin`)
- **Overview**: MRR, user count, org count, active subscriptions, plan distribution chart, org type breakdown, recent activity
- **Organizations**: Full table with member list, plan, status, revenue. Actions: manage subscription, update payment, delete
- **Users**: Grouped by organization with separator headers. Actions: account recovery (reset email, force reset, unlock, revoke sessions), remove user
- **Homepage CMS**: Edit headline, subheadline, badge, CTAs, 4 stats, announcement bar — with live preview
- **Platform Settings**: View/edit platform config values

---

## API Reference

### Auth
| Method | Route              | Auth     | Description              |
|--------|--------------------|----------|--------------------------|
| POST   | /api/auth/register | —        | Register + create org    |
| POST   | /api/auth/login    | —        | Login                    |
| GET    | /api/auth/me       | User     | Current user + org       |
| PUT    | /api/auth/password | User     | Change password          |

### Sites
| Method | Route           | Auth | Description        |
|--------|-----------------|------|--------------------|
| GET    | /api/sites      | User | List org sites     |
| POST   | /api/sites      | User | Create site        |
| GET    | /api/sites/:id  | User | Get site           |
| PUT    | /api/sites/:id  | User | Save site          |
| DELETE | /api/sites/:id  | User | Delete site        |

### Organizations
| Method | Route          | Auth | Description         |
|--------|----------------|------|---------------------|
| GET    | /api/orgs/mine | User | Get my org          |
| PUT    | /api/orgs/mine | User | Update org settings |
| PUT    | /api/orgs/billing | User | Update plan/card |

### Users
| Method | Route                  | Auth  | Description        |
|--------|------------------------|-------|--------------------|
| PUT    | /api/users/profile     | User  | Update profile     |
| POST   | /api/users/invite      | Owner | Invite team member |
| DELETE | /api/users/member/:id  | Owner | Remove member      |

### Admin (requires admin role)
| Method | Route                              | Description                |
|--------|------------------------------------|----------------------------|
| GET    | /api/admin/stats                   | Platform stats + MRR       |
| GET    | /api/admin/orgs                    | All organizations          |
| GET    | /api/admin/users                   | All users                  |
| POST   | /api/admin/recovery/:userId        | Account recovery actions   |
| PUT    | /api/admin/orgs/:orgId/subscription | Change plan/status        |
| PUT    | /api/admin/orgs/:orgId/payment     | Update payment info        |
| DELETE | /api/admin/orgs/:orgId             | Delete org + data          |
| DELETE | /api/admin/users/:userId           | Remove user                |

### Homepage CMS
| Method | Route          | Auth  | Description              |
|--------|----------------|-------|--------------------------|
| GET    | /api/homepage  | —     | Get CMS data (public)    |
| PUT    | /api/homepage  | Admin | Update CMS data          |

---

## Production Build

```bash
npm run build          # builds client to client/dist/
NODE_ENV=production node server/index.js   # serves API + static files
```

---

## Connecting Stripe (production)

In `server/routes/orgs.js` and `server/routes/admin.js`, payment logic is simulated.
To wire real payments:

1. `npm install stripe` in root
2. Add `STRIPE_SECRET_KEY` to `.env`
3. Replace the billing route logic with Stripe Customer + Subscription API calls
4. Add a `/api/webhooks/stripe` route for subscription lifecycle events

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router 6    |
| Styling   | Custom CSS vars (no Tailwind)     |
| State     | React Context + useState          |
| HTTP      | Axios with JWT interceptors       |
| Backend   | Node.js, Express 4                |
| Database  | MongoDB + Mongoose 8              |
| Auth      | JWT (jsonwebtoken) + bcryptjs     |
| Fonts     | Playfair Display, Instrument Sans |
# Sanctuary-CMS
