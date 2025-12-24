# OpenLaughs 🎭

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/mgennings/openlaughs)

OpenLaughs is a modern, mobile-first web application built to organize and
amplify the live comedy scene in Austin, TX. It's a centralized hub for
comedians, fans, and promoters to discover, schedule, promote, and attend comedy
shows.

**Repository**:
[https://github.com/mgennings/openlaughs](https://github.com/mgennings/openlaughs)

---

## 🎯 Product Vision

Live comedy in Austin is fragmented. Fans can't easily discover shows, comedians
struggle to find venues, and promoters rely on inconsistent tools. OpenLaughs
solves this by offering a clean, scalable platform to:

- **Discover** shows, comedians, and venues
- **Connect** comedians with promoters and fans
- **Manage** shows, bookings, and profiles
- **Grow** Austin's comedy community

---

## ✨ Current Features

### ✅ Core Features (Complete)

- **Authentication & Onboarding**

  - Email-based authentication (Cognito)
  - Social login (Google, Apple)
  - Role-based onboarding (Fan, Comedian, Promoter, Admin)
  - Admin password protection

- **Comedian Management**

  - Full CRUD operations
  - 25+ field comprehensive profiles
  - Profile images with auto-resizing
  - Search and directory
  - Featured and verified badges
  - Social media integration

- **Show Management**

  - Create, edit, and delete shows
  - Link multiple comedians per show
  - Venue integration
  - Ticket URLs and pricing
  - Age restrictions
  - Show images

- **Venue Management**

  - Complete CRUD operations
  - Google Places integration
  - Multiple venue images
  - Venue directory and detail pages

- **User Engagement**

  - Follow comedians (favorites)
  - Favorite venues
  - RSVP to shows
  - Saved shows tracking
  - User activity tracking

- **Role-Based Dashboards**

  - Fan Dashboard (with engagement stats)
  - Comedian Dashboard (shows, profile completeness)
  - Promoter Dashboard (venues, shows)
  - Admin Dashboard (platform statistics)

- **Landing Page**
  - Modern, responsive design
  - Real-time content (shows, comedians)
  - Clear value propositions

### 🚧 In Progress

- Reviews & Ratings UI
- Advanced search and filtering
- Show scraper (for automatic show imports)

### 📋 Planned

- Booking system
- Messaging between users
- Calendar sync (iCal/Google)
- Email notifications
- Analytics dashboard

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React 18 + Vite + TypeScript        |
| Styling   | TailwindCSS + Radix UI + Shadcn UI  |
| Backend   | AWS Amplify (Cognito + AppSync)     |
| Auth      | Cognito User Pools (Email + Social) |
| API       | AppSync GraphQL + DynamoDB          |
| Storage   | S3 (with Lambda image resizing)     |
| Hosting   | Amplify Hosting                     |
| Functions | AWS Lambda (image resizer, Whisper) |
| DevTools  | ESLint, Prettier, TypeScript, Husky |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and Yarn
- AWS Account with Amplify CLI installed
- AWS CLI configured with `personal-account` profile

### 1. Clone & Install

```bash
git clone https://github.com/mgennings/openlaughs.git
cd OpenLaughs
yarn install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env-example .env
```

Edit `.env` and configure:

```env
VITE_APP_NAME=OpenLaughs
VITE_APP_VERSION=1.0.0

# Google Maps API Key (for venue autocomplete)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here

# OpenAI Whisper API URL (for transcription tool)
VITE_WHISPER_API_URL=https://your_api_here.execute-api.us-east-1.amazonaws.com/dev/whisper

# Admin Password (for admin role selection during onboarding)
VITE_ADMIN_PASSWORD=your_secure_admin_password_here
```

### 3. AWS Amplify Setup

Pull the Amplify backend configuration:

```bash
amplify pull --profile personal-account
```

This will:

- Download your GraphQL schema
- Configure API endpoints
- Set up authentication
- Configure storage buckets

### 4. Start Development Server

```bash
yarn dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
yarn build
```

Output will be in the `dist/` directory.

---

## 📁 Project Structure

```
OpenLaughs/
├── amplify/                    # AWS Amplify backend configuration
│   ├── backend/
│   │   ├── api/               # GraphQL API schema & resolvers
│   │   ├── auth/              # Cognito auth configuration
│   │   ├── function/          # Lambda functions
│   │   └── storage/           # S3 bucket configuration
│   └── team-provider-info.json
├── src/
│   ├── auth/                  # Authentication components & hooks
│   ├── components/            # Shared UI components
│   │   ├── engagement/       # Favorite, RSVP buttons
│   │   ├── ui/               # Shadcn UI components
│   │   └── ...
│   ├── config/               # App configuration
│   ├── graphql/              # Auto-generated GraphQL operations
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Page layouts
│   ├── pages/                # Page components
│   │   ├── account/          # User account pages
│   │   ├── dashboards/       # Role-based dashboards
│   │   ├── landing/          # Landing page
│   │   ├── onboarding/       # Onboarding flows
│   │   ├── shows/            # Show pages
│   │   ├── comedians/        # Comedian pages
│   │   └── ...
│   ├── partials/             # Reusable page sections
│   ├── providers/            # React context providers
│   ├── routing/              # Route configuration
│   ├── styles/               # Global styles
│   ├── utils/                # Utility functions
│   └── API.ts                # Typed GraphQL models
├── .env-example              # Environment variables template
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🔐 Environment Variables

| Variable                   | Description                                | Required               |
| -------------------------- | ------------------------------------------ | ---------------------- |
| `VITE_APP_NAME`            | Application name                           | Yes                    |
| `VITE_APP_VERSION`         | Application version                        | Yes                    |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key for venue autocomplete | Optional               |
| `VITE_WHISPER_API_URL`     | Whisper transcription API endpoint         | Optional               |
| `VITE_ADMIN_PASSWORD`      | Password for admin role selection          | Yes (for admin access) |

---

## 📡 AWS Amplify Configuration

### Backend Resources

- **API**: AppSync GraphQL API
- **Auth**: Cognito User Pool (Email + Google/Apple)
- **Storage**: S3 bucket for images
- **Functions**:
  - `imageResizer` - Auto-resizes uploaded images
  - `whisperTranscribe` - Audio transcription service

### GraphQL Schema

Key models:

- `UserProfile` - User accounts with roles
- `Comedian` - Comedian profiles
- `Show` - Comedy shows/events
- `Venue` - Comedy venues
- `FavoriteComedian` - User favorites
- `FavoriteVenue` - Venue favorites
- `ShowRSVP` - Show RSVPs
- `ShowReview` - Show reviews
- `ComedianReview` - Comedian reviews

See `amplify/backend/api/openlaughs/schema.graphql` for full schema.

### Working with Amplify

```bash
# Pull latest backend changes
amplify pull --profile personal-account

# Push local changes to AWS
amplify push --profile personal-account

# View backend status
amplify status

# Generate GraphQL types (after schema changes)
amplify codegen
```

---

## 🛠 Development

### Available Scripts

```bash
# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint and fix code
yarn lint

# Check linting without fixing
yarn lint:check

# Type check
yarn type-check

# Run validation (type check + lint)
yarn validate
```

### Code Quality

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit validation
- **TypeScript**: Full type safety

### Development Workflow

1. Create a feature branch
2. Make changes
3. Run `yarn validate` before committing
4. Commit (Husky will run lint-staged)
5. Push and create PR

---

## 🎨 UI Components

### Component Libraries

- **Shadcn UI**: Base component library (Radix UI primitives)
- **Keen Icons**: Icon library (Metronic)
- **TailwindCSS**: Utility-first styling

### Key Components

- `components/engagement/` - Favorite, RSVP buttons
- `components/ui/` - Shadcn UI components
- `partials/` - Reusable page sections (cards, widgets, modals)
- `layouts/` - Page layout wrappers

### Styling

- Tailwind utilities throughout
- Custom theme in `src/styles/shadcn.ui.css`
- Responsive design (mobile-first)
- Dark mode support (via SettingsProvider)

---

## 📚 Documentation

Additional documentation files:

- **`PROJECT_STATUS_ANALYSIS.md`** - Current project status and gaps
- **`NEXT_STEPS.md`** - Strategic roadmap and next priorities
- **`SCRAPER_OPTIONS.md`** - Show scraper implementation guide
- **`amplify/backend/function/*/README.md`** - Lambda function docs

---

## 🧪 Testing

Currently manual testing. Test coverage to be added.

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Role-based onboarding
- [ ] Admin password protection
- [ ] Comedian profile creation/editing
- [ ] Show creation with multiple comedians
- [ ] Venue creation with Google Places
- [ ] Favorites and RSVPs
- [ ] Dashboard views per role

---

## 🚢 Deployment

### Amplify Hosting

The app is deployed via AWS Amplify Hosting. Push to main branch triggers
automatic deployment.

### Environment-Specific Configs

- **Development**: Uses `dev` environment
- **Production**: Configured in Amplify console

### Build Configuration

See `amplify.yml` for build settings.

---

## 🤝 Contributing

1. Fork the [repository](https://github.com/mgennings/openlaughs)
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run `yarn validate` to ensure code quality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request on GitHub

### Code Style

- Follow existing code patterns
- Use TypeScript for all new files
- Write descriptive commit messages
- Add comments for complex logic

---

## 🐛 Troubleshooting

### Common Issues

**Amplify pull fails**

```bash
# Make sure AWS CLI is configured
aws configure --profile personal-account

# Try pulling again
amplify pull --profile personal-account
```

**GraphQL types out of date**

```bash
# After schema changes, regenerate types
amplify codegen
```

**Environment variables not loading**

- Make sure `.env` file exists (not just `.env-example`)
- Restart dev server after changing `.env`
- Check that variables start with `VITE_`

**Images not uploading**

- Check S3 bucket permissions
- Verify `imageResizer` Lambda function is deployed
- Check browser console for errors

**Authentication issues**

- Clear browser localStorage
- Check Cognito User Pool configuration
- Verify social providers are configured in Amplify

---

## 📝 License

MIT License © Matthew Gennings

---

## 🙏 Acknowledgments

- **Shadcn UI** - Component library
- **Radix UI** - Accessible component primitives
- **AWS Amplify** - Backend infrastructure
- **Metronic** - UI framework inspiration

---

## 📞 Support

For issues, questions, or contributions:

- **GitHub**:
  [https://github.com/mgennings/openlaughs](https://github.com/mgennings/openlaughs)
- Open an issue on GitHub
- Check existing documentation files
- Review `PROJECT_STATUS_ANALYSIS.md` for current state

---

**Built with ❤️ for Austin's comedy community**
