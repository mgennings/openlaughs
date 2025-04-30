# OpenLaughs 🎭

OpenLaughs is a modern, mobile-first web application built to organize and
amplify the live comedy scene in Austin, TX. It's a centralized hub for
comedians, fans, and promoters to discover, schedule, promote, and attend comedy
shows.

---

## 🎯 Product Vision

Live comedy in Austin is fragmented. Fans can’t easily discover shows, comedians
struggle to find venues, and promoters rely on inconsistent tools. OpenLaughs
solves this by offering a clean, scalable platform to:

- Discover and explore venues and shows
- Manage personal calendars and event reminders
- Connect comedians with promoters
- Post, book, and moderate shows easily

---

## 👤 User Personas

### • Comedians

- Venue Explorer Feed
- Booking workflow
- Calendar sync (iCal/Google)
- Messaging with promoters

### • Fans

- Calendar view of shows
- Weekly “Top Picks” carousel
- Filterable list of events
- Add-to-calendar & ticket links

### • Promoters

- Show posting + lineup builder
- Comedian search + contact
- Messaging system
- Exportable reports (future)

### • Admin

- Full resource CRUD
- Ban/unban controls
- CSV import of shows & venues

---

## ⚙️ Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Frontend | React 18 + Vite + TypeScript       |
| Styling  | TailwindCSS + Radix UI + Shadcn UI |
| Backend  | AWS Amplify (Cognito + AppSync)    |
| Auth     | Cognito User Pools (Email login)   |
| API      | AppSync GraphQL + DynamoDB         |
| Hosting  | Amplify Hosting                    |
| DevTools | ESLint, Prettier, TypeScript       |

---

## 🧱 Project Structure

```
src/
├── auth/                  # Auth provider (Cognito-based)
├── components/            # Shared UI components
├── graphql/               # Auto-generated GraphQL operations
├── pages/                 # App routes
├── providers/             # Context providers
├── styles/                # Theme + design system overrides
├── API.ts                 # Typed GraphQL model interfaces
└── aws-exports.js         # Amplify config (gitignored)
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Start Dev Server

```bash
yarn dev
```

### 3. Build for Production

```bash
yarn build
```

### 4. Lint the Code

```bash
yarn lint
```

---

## 📡 AWS Amplify Setup

- Amplify is initialized with `personal-account` profile
- Use `amplify pull` on new machines:
  ```bash
  amplify pull --profile personal-account
  ```

---

## 🌐 UI System

- UI components are based on [Shadcn UI](https://ui.shadcn.com) and Radix
  primitives
- Tailwind utilities are used throughout
- Theme overrides and mappings live in `src/styles/shadcn.ui.css`

---

## 📅 MVP Modules (In Progress)

- [x] Cognito Auth (email-based)
- [x] GraphQL schema deployed (Show, Venue, UserProfile)
- [ ] Show calendar views (public)
- [ ] Comedian dashboards
- [ ] Promoter tools
- [ ] Admin panel

---

## Setup Demos(Demo 1 - Demo 10)

- Please refer to this guide to set up your preferred demo effortlessly.
  [Metronic 9 Tailwind React Demos Setup](https://devs.keenthemes.com/question/metronic-9-tailwind-react-demos-setup)

---

## 🧠 Design Principles

- Mobile-first UI
- Role-based access from day one
- Manual-first workflows that evolve into automation
- Serverless and scalable from backend to frontend

---

## 🛠 Contributions

This project is under active development. If you'd like to contribute, open a PR
or issue. For local dev, ensure you're using the `dev` environment and
`personal-account` AWS profile.

---

## 🤝 Support

Metronic and Shadcn UI are supported by their respective creators. AWS Amplify
is used under the free-tier developer plan.

---

MIT License © Matthew Gennings
