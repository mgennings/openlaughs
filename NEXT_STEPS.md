# OpenLaughs - Next Steps & Strategic Roadmap

## Current State (As of Nov 18, 2025)

### ✅ Recently Completed Features

- Show display components with links and age requirements
- Dashboard shows widget integration
- Show deletion capability
- Modal-based create flows for Shows and Venues
- Lambda function for automatic image resizing
- User onboarding with role selection (Fan, Comedian, Promoter, Admin)
- UserProfile database model with role field

### 🎯 Current Challenge

The dashboard is currently designed from an **admin/promoter perspective** with
business-focused widgets (earnings, social stats, team meetings) that aren't
relevant to the average user (Fans). We need role-specific dashboards.

---

## Critical Missing Features

### 1. **Comedian Management System** 🎤

**Problem**: No way for admins/promoters to add comedians to the platform or for
comedians to create their own profiles.

**What's Needed**:

- [ ] Comedian data model (already exists in schema?)
- [ ] Comedian creation form (admin/promoter access)
- [ ] Comedian self-registration/profile creation
- [ ] Comedian profile pages (public-facing)
- [ ] Comedian listing/directory page
- [ ] Search and filter comedians
- [ ] Link comedians to shows
- [ ] Comedian availability management

**Questions to Answer**:

- Can comedians self-register, or only admins/promoters can add them?
- Should comedians be UserProfiles with role='comedian' or a separate Comedian
  model?
- How do we handle comedian photos, bios, social links, etc.?

### 2. **Venue Management (Partially Complete)**

- [x] Venue creation (modal)
- [x] Venue editing
- [ ] Venue listing/directory page
- [ ] Venue detail pages
- [ ] Venue photos and details
- [ ] Link venues to promoters
- [ ] Venue search and filters

### 3. **Show Management (Partially Complete)**

- [x] Show creation (modal)
- [x] Show display widgets
- [x] Show detail pages
- [x] Show deletion
- [ ] Show editing
- [ ] Link shows to comedians (not just venues)
- [ ] Show ticketing/RSVP system
- [ ] Show capacity and availability
- [ ] Show status (upcoming, past, cancelled)

---

## Role-Based Dashboard Strategy

### Current Issue

All users see the same dashboard regardless of their role. The current dashboard
is business-focused and not relevant to Fans (your primary user base).

### Proposed Solution: Role-Specific Dashboards

#### 🎭 **FAN Dashboard** (Priority: HIGH)

**Focus**: Discovery, personalization, engagement

**Widgets to Build**:

- **Upcoming Shows** - Shows near their location or at favorited venues
- **Favorited Comedians** - Quick access to comedians they follow
- **Recommended Shows** - Based on location, preferences, followed comedians
- **Recently Viewed** - Shows/Comedians they've checked out
- **Saved Venues** - Their favorite comedy clubs
- **Ticket Reminders** - Shows they plan to attend
- **Quick Stats Card**:
  - Shows attended
  - Comedians following
  - Reviews written
  - Venues saved

**Missing Data Models for Fans**:

- [ ] User favorites (comedians, venues)
- [ ] Show attendance/RSVPs
- [ ] User reviews/ratings
- [ ] View history

---

#### 🎤 **COMEDIAN Dashboard** (Priority: MEDIUM)

**Focus**: Career management, bookings, audience engagement

**Widgets to Build**:

- **My Upcoming Shows** - Their booked performances (chronological)
- **Performance Stats**:
  - Total shows completed
  - Average audience size
  - Average rating
  - Profile views this month
- **Booking Requests** - From promoters (if we build booking system)
- **Recent Activity Feed**:
  - New followers
  - Reviews received
  - Comments on shows
- **Profile Completeness** - Encourage filling out bio, photos, etc.
- **Quick Actions**:
  - Update availability
  - View public profile
  - Respond to bookings

**Missing Features for Comedians**:

- [ ] Comedian profiles (bio, photos, socials, style/tags)
- [ ] Availability calendar
- [ ] Booking request system
- [ ] Follower system
- [ ] Analytics (profile views, fan engagement)

---

#### 📈 **PROMOTER Dashboard** (Priority: MEDIUM)

**Focus**: Venue/show management, comedian booking, analytics

**Widgets to Build**:

- **My Venues** - Quick access to venues they manage
- **Upcoming Shows** - Shows at their venues
- **Venue Performance**:
  - Ticket sales (if we add ticketing)
  - Attendance rates
  - Revenue trends
- **Comedian Roster** - Talent they've worked with or booked
- **Show Management** - Create/edit shows quickly
- **Booking Calendar** - Visualize show schedule
- **Quick Actions**:
  - Create show
  - Create venue
  - Contact comedian
  - View analytics

**Current State**:

- Have venues and shows partially implemented
- Missing: Analytics, booking system, comedian connections

---

#### ⚙️ **ADMIN Dashboard** (Priority: LOW - Current dashboard works)

**Focus**: Platform management, content moderation, system health

**Keep Current Widgets + Add**:

- **Platform Stats**:
  - Total users (by role)
  - Total shows
  - Total venues
  - Total comedians
- **Recent Activity** - New signups, shows created, etc.
- **Content Moderation** - Flagged content queue
- **System Health** - Error logs, performance metrics
- **User Management** - Quick access to manage users
- **Quick Actions**:
  - Create any content type
  - Moderate content
  - Manage users

---

## Technical Implementation Plan

### Phase 1: Core Data Models & Comedian System (Foundation)

**Priority: CRITICAL** - Can't build much without this

1. **Define Comedian Model** (or use UserProfile with role='comedian')

   ```graphql
   type Comedian {
     id: ID!
     userId: ID! # Link to UserProfile
     stageName: String!
     bio: String
     profileImageKey: String
     genres: [String]
     socialLinks: AWSJSON
     yearsActive: Int
     basedIn: String
     createdAt: AWSDateTime!
     updatedAt: AWSDateTime!
   }
   ```

2. **Comedian CRUD Operations**

   - [ ] Create comedian form (admin/promoter)
   - [ ] Comedian self-registration flow
   - [ ] Edit comedian profile
   - [ ] Delete comedian (admin only)

3. **Comedian Directory**

   - [ ] List all comedians page
   - [ ] Search/filter functionality
   - [ ] Comedian detail/profile pages

4. **Link Comedians to Shows**
   - [ ] Update Show model to include comedian references
   - [ ] UI for selecting comedians when creating shows
   - [ ] Display comedians on show detail pages

### Phase 2: User Engagement Features (Fan Focus)

**Priority: HIGH** - Make the app useful for regular users

1. **Favorites System**

   - [ ] Favorite comedians
   - [ ] Favorite venues
   - [ ] Save shows ("interested in")
   - [ ] Database models for favorites

2. **Show RSVP/Attendance**

   - [ ] RSVP to shows
   - [ ] Attendance tracking
   - [ ] Show capacity management

3. **Reviews & Ratings**

   - [ ] Review shows after attending
   - [ ] Rate comedians
   - [ ] Display ratings on profiles

4. **User Activity Tracking**
   - [ ] Recently viewed shows/comedians
   - [ ] View history
   - [ ] Personalized recommendations

### Phase 3: Role-Based Dashboards

**Priority: HIGH** - Different experiences for different users

1. **Infrastructure**

   - [ ] Create `useUserProfile()` hook to fetch current user's profile + role
   - [ ] Create dashboard routing based on role
   - [ ] Design reusable dashboard widget components

2. **Build Fan Dashboard**

   - [ ] Upcoming shows widget
   - [ ] Favorited comedians widget
   - [ ] Recommended shows widget
   - [ ] Quick stats card
   - [ ] Recently viewed widget

3. **Build Comedian Dashboard**

   - [ ] My shows widget
   - [ ] Performance stats widget
   - [ ] Recent activity feed
   - [ ] Profile completeness card

4. **Build Promoter Dashboard**

   - [ ] My venues widget
   - [ ] Upcoming shows widget
   - [ ] Show management tools
   - [ ] Analytics widgets (if data available)

5. **Enhance Admin Dashboard**
   - [ ] Platform-wide statistics
   - [ ] User management quick access
   - [ ] Content moderation tools

### Phase 4: Advanced Features

**Priority: MEDIUM-LOW** - Nice to have, build when core is solid

1. **Booking System**

   - [ ] Promoters request comedians for shows
   - [ ] Comedians accept/decline bookings
   - [ ] Availability calendar
   - [ ] Booking status tracking

2. **Ticketing Integration**

   - [ ] Ticket sales (or external integration)
   - [ ] Capacity management
   - [ ] Check-in system

3. **Social Features**

   - [ ] Follow comedians
   - [ ] Follow venues
   - [ ] Activity feed
   - [ ] Comments on shows

4. **Search & Discovery**

   - [ ] Global search (shows, comedians, venues)
   - [ ] Advanced filtering
   - [ ] Location-based recommendations
   - [ ] Genre/style tagging

5. **Analytics & Reporting**
   - [ ] Comedian performance analytics
   - [ ] Venue analytics for promoters
   - [ ] Platform-wide analytics for admins

---

## Immediate Next Steps (Priority Order)

### 1. **Decide on Comedian Model** ⚡

**Decision needed**:

- Option A: Use existing `UserProfile` with `role='comedian'` + add
  comedian-specific fields
- Option B: Create separate `Comedian` model linked to `UserProfile`
- **Recommendation**: Option B - cleaner separation, easier to extend

### 2. **Build Comedian Management** ⚡

- Create Comedian GraphQL schema
- Build comedian creation form (admin/promoter access)
- Create comedian directory/listing page
- Build comedian profile pages
- Link comedians to shows

### 3. **Create `useUserProfile()` Hook** ⚡

```typescript
// Hook to fetch current user's UserProfile and role
const useUserProfile = () => {
  const { currentUser } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user's profile from GraphQL using their email
  // Return { profile, role, loading }
};
```

### 4. **Build Fan Dashboard** ⚡

- Start with simplest, most useful widgets for fans
- Focus on discovery and engagement
- Make the app actually useful for regular comedy fans

### 5. **Iterate on Other Dashboards**

- Comedian dashboard
- Promoter dashboard
- Enhance admin dashboard

---

## Key Questions to Answer

### Data & Relationships

1. **Comedian Model**: Separate entity or part of UserProfile?
2. **Show-Comedian Relationship**: One comedian per show or multiple?
3. **Venue-Promoter Relationship**: One owner or multiple managers?
4. **User Favorites**: Separate tables or embedded in UserProfile?

### Features & Scope

5. **Authentication**: Can comedians self-register or admin-only creation?
6. **Ticketing**: Build in-house or integrate with external (Eventbrite, etc.)?
7. **Booking**: Build a booking request system or keep it manual?
8. **Reviews**: Allow reviews for shows, comedians, venues, or all?

### UX & Design

9. **Dashboard Default**: Which dashboard should admins see by default?
10. **Role Switching**: Can users have multiple roles (comedian + promoter)?
11. **Onboarding**: Different onboarding flows per role?
12. **Public vs Private**: What data is public vs user-specific?

---

## Technical Debt & Improvements

### Current Issues

- [ ] No error boundaries in critical components
- [ ] Image handling is manual (though resizer lambda helps)
- [ ] No loading states in many components
- [ ] No pagination on lists (will be needed for comedians, shows)
- [ ] Auth doesn't track user role easily (need useUserProfile hook)

### Performance Considerations

- [ ] Implement pagination for large lists
- [ ] Add caching for frequently accessed data
- [ ] Optimize GraphQL queries (avoid over-fetching)
- [ ] Consider adding search indices (Algolia, ElasticSearch?)

### Testing & Quality

- [ ] Add unit tests for critical business logic
- [ ] Add integration tests for auth flows
- [ ] Add E2E tests for major user journeys
- [ ] Implement proper error tracking (Sentry?)

---

## Resources & Dependencies

### Current Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: AWS Amplify, AppSync (GraphQL), DynamoDB
- **Auth**: AWS Cognito
- **Storage**: S3 (with Lambda image resizer)

### Potential Additions

- **Search**: Algolia or AWS OpenSearch
- **Ticketing**: Stripe, Eventbrite API, or custom
- **Maps**: Google Maps API (for venue locations)
- **Analytics**: Mixpanel, Amplitude, or custom
- **Email**: AWS SES (for notifications)

---

## Notes & Considerations

### Business Logic

- **Who can create shows?**: Promoters + Admins only, or comedians too?
- **Show ownership**: Can multiple promoters manage the same show?
- **Venue ownership**: Private venues vs public directory?
- **Comedian verification**: How do we verify real comedians vs fans pretending?

### Scalability

- DynamoDB will scale well, but need to design access patterns carefully
- Consider caching layer for frequently accessed data (comedian profiles, show
  listings)
- Image resizer Lambda is good, but may need CDN (CloudFront) for high traffic

### Monetization (Future)

- Ticketing fees/commissions
- Promoted listings for comedians/venues
- Premium features for promoters (advanced analytics)
- Sponsored shows or featured placements

---

## Success Metrics

### For Fans

- Number of active users
- Shows viewed per session
- Favorite/save actions
- Return visitor rate
- Time spent on platform

### For Comedians

- Profile completion rate
- Number of shows linked
- Profile views
- Follower growth

### For Promoters

- Number of shows created
- Venues managed
- Engagement with comedian profiles
- Show attendance rates (if tracked)

### Platform Health

- User registration by role
- Content creation velocity (shows, venues, comedians)
- User retention by role
- Error rates and performance

---

## Getting Started with Next Phase

### Recommended First Steps:

1. **Define Comedian schema** in `amplify/backend/api/openlaughs/schema.graphql`
2. **Create Comedian management pages** in `src/pages/comedians/`
3. **Build `useUserProfile()` hook** in `src/hooks/useUserProfile.ts`
4. **Create role-based dashboard routing** in `src/pages/dashboards/`
5. **Build Fan dashboard widgets** in `src/pages/dashboards/fan/`

### Time Estimates (Rough)

- **Comedian System**: 2-3 days
- **useUserProfile Hook + Routing**: 0.5 day
- **Fan Dashboard**: 2-3 days
- **Other Dashboards**: 1-2 days each
- **Total for Core Features**: ~2 weeks

---

## Conclusion

You've made excellent progress on the foundation! The next phase requires:

1. **Comedian management** (critical missing piece)
2. **Role-based dashboards** (make app useful for all user types)
3. **User engagement features** (favorites, RSVPs, etc.)

Focus on building the **Fan experience first** since they'll be your primary
user base. Once fans can discover and engage with comedy content effectively,
you can enhance comedian and promoter tools.

Remember: **Start simple, iterate based on real usage patterns.**

---

**Last Updated**: November 18, 2025
