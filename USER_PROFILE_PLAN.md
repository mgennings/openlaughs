# User Profile Development Plan

**Date**: November 21, 2025  
**Goal**: Build out user profiles with engagement features (favorites, shows
attended, etc.)

---

## 🎯 Overview

Transform the demo public profile pages into real, functional user profiles that
display:

- Shows attended / RSVPs
- Favorite comedians
- Favorite venues
- Activity history
- User stats and badges
- Recent activity feed

---

## 📊 Current State

### What Exists

✅ **Account User Profile** (`/account/home/user-profile`)

- Personal Info edit form
- Basic Settings
- Work info
- Community Badges (demo)
- Connections (demo)
- Calendar Accounts (demo)
- My Files (demo)

✅ **Public Profile Demo Pages** (`/public-profile/profiles/`)

- ProfileDefaultPage - Beautiful layout with About, Work Experience, Projects,
  etc.
- ProfileCreatorPage - Content creator focus
- ProfileGamerPage - Gamer stats and achievements
- Many others (blogger, company, nft, etc.)

### What's Missing

❌ **Real User Profile Data Integration**

- No connection between UserProfile data and public profile pages
- No shows attended tracking
- No favorites system
- No RSVP/saved shows
- No activity history
- No real stats (everything is hardcoded demos)

---

## 🏗️ Architecture Plan

### Phase 1: Data Models (GraphQL Schema) - FOUNDATION

Add the following models to `amplify/backend/api/openlaughs/schema.graphql`:

```graphql
# User favorites comedians
type FavoriteComedian
  @model
  @auth(
    rules: [
      { allow: owner, ownerField: "userProfileId" }
      { allow: private, operations: [read] }
    ]
  ) {
  id: ID!
  userProfileId: ID!
  comedianId: ID!
  createdAt: AWSDateTime!
}

# User favorites venues
type FavoriteVenue
  @model
  @auth(
    rules: [
      { allow: owner, ownerField: "userProfileId" }
      { allow: private, operations: [read] }
    ]
  ) {
  id: ID!
  userProfileId: ID!
  venueId: ID!
  createdAt: AWSDateTime!
}

# Show RSVPs / Saved Shows
type ShowRSVP
  @model
  @auth(
    rules: [
      { allow: owner, ownerField: "userProfileId" }
      { allow: private, operations: [read] }
    ]
  ) {
  id: ID!
  userProfileId: ID!
  showId: ID!
  status: String # 'interested', 'going', 'attended', 'cancelled'
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# User activity tracking (optional - for recently viewed)
type UserActivity
  @model
  @auth(rules: [{ allow: owner, ownerField: "userProfileId" }]) {
  id: ID!
  userProfileId: ID!
  activityType: String # 'viewed_comedian', 'viewed_show', 'viewed_venue'
  entityId: ID!
  entityType: String # 'comedian', 'show', 'venue'
  createdAt: AWSDateTime!
}

# Show reviews (future - Phase 2B)
type ShowReview
  @model
  @auth(
    rules: [
      { allow: owner, ownerField: "userProfileId" }
      { allow: private, operations: [read] }
      { allow: public, operations: [read] }
    ]
  ) {
  id: ID!
  userProfileId: ID!
  showId: ID!
  rating: Int # 1-5 stars
  review: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

# Comedian reviews (future - Phase 2B)
type ComedianReview
  @model
  @auth(
    rules: [
      { allow: owner, ownerField: "userProfileId" }
      { allow: private, operations: [read] }
      { allow: public, operations: [read] }
    ]
  ) {
  id: ID!
  userProfileId: ID!
  comedianId: ID!
  rating: Int # 1-5 stars
  review: String
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}
```

**Estimated Time**: 1-2 hours (schema definition + Amplify push)

---

### Phase 2: UI Components for Engagement

#### A. Favorite/Follow Buttons

**Create**: `src/components/engagement/FavoriteButton.tsx`

- Heart icon button for comedians
- Star icon button for venues
- Toggle on/off state
- Mutation to create/delete favorite
- Optimistic UI updates

**Create**: `src/components/engagement/RSVPButton.tsx`

- "I'm Going" / "Interested" / "Save" button for shows
- Dropdown with status options
- Mutation to create/update RSVP
- Show current status

**Estimated Time**: 3-4 hours

---

#### B. Profile Stats Widget

**Create**: `src/pages/public-profile/blocks/ProfileStats.tsx`

- Query all user data:
  - Shows attended (ShowRSVP with status='attended')
  - Comedians following (count FavoriteComedian)
  - Venues favorited (count FavoriteVenue)
  - Saved shows (ShowRSVP with status='going' or 'interested')
  - Reviews written (if implemented)
- Display in grid of stat cards
- Similar to Fan Dashboard quick stats

**Estimated Time**: 2 hours

---

#### C. Favorite Comedians Section

**Create**: `src/pages/public-profile/blocks/FavoriteComedians.tsx`

- Query user's FavoriteComedian records
- Load comedian details for each
- Display in grid of comedian cards (like comedian directory)
- Link to comedian profiles
- Show count in header
- Empty state: "No favorite comedians yet"

**Estimated Time**: 3 hours

---

#### D. Favorite Venues Section

**Create**: `src/pages/public-profile/blocks/FavoriteVenues.tsx`

- Query user's FavoriteVenue records
- Load venue details for each
- Display in grid of venue cards
- Link to venue pages
- Show count in header
- Empty state: "No favorite venues yet"

**Estimated Time**: 3 hours

---

#### E. Saved/Upcoming Shows Section

**Create**: `src/pages/public-profile/blocks/SavedShows.tsx`

- Query user's ShowRSVP records (status = 'going' or 'interested')
- Load show details (with venue and comedians)
- Display in list format (chronological)
- Show RSVP status badges
- Filter: Upcoming vs Past
- Link to show detail pages
- Empty state: "No saved shows yet"

**Estimated Time**: 4 hours

---

#### F. Shows Attended History

**Create**: `src/pages/public-profile/blocks/ShowsAttended.tsx`

- Query ShowRSVP with status='attended'
- Display past shows with dates
- Show comedian lineup
- Optional: Link to reviews (if implemented)
- Stats: Total attended, Last attended date
- Empty state: "No shows attended yet"

**Estimated Time**: 3 hours

---

#### G. Recent Activity Feed

**Create**: `src/pages/public-profile/blocks/RecentActivity.tsx`

- Query UserActivity for recent views/actions
- Display timeline of:
  - Viewed comedian
  - Saved show
  - Favorited venue
  - Attended show
  - Left review
- Time-based grouping (Today, Yesterday, This Week)
- Links to entities

**Estimated Time**: 4 hours

---

### Phase 3: Integrate Into Profile Pages

#### A. Update Account User Profile

**Modify**: `src/pages/account/home/user-profile/AccountUserProfileContent.tsx`

Add new sections:

- ProfileStats (at top)
- Favorite Comedians
- Favorite Venues
- Saved Shows
- Shows Attended
- Recent Activity

Keep existing:

- Personal Info (for editing)
- Basic Settings
- Work
- Community Badges
- Connections
- My Files

**Estimated Time**: 2 hours

---

#### B. Create Public Profile Page

**Create**: `src/pages/public-profile/user/UserPublicProfilePage.tsx`

Similar to Account Profile but:

- Read-only view
- Accessible via `/profile/:userId` or `/profile/me`
- Shows public data only
- Can be shared with others
- Privacy controls (show/hide sections)

Sections to show:

- Profile header (avatar, name, bio, location)
- Quick stats
- Favorite comedians (public)
- Favorite venues (public)
- Shows attended count (not list - privacy)
- Community badges
- Recent activity (filtered for public)

**Estimated Time**: 4 hours

---

### Phase 4: Add Engagement Buttons Throughout App

Add favorite/RSVP buttons to existing pages:

1. **Comedian Detail Page** (`src/pages/comedians/ComedianDetailPage.tsx`)

   - Add "Follow Comedian" button in header
   - Show follower count

2. **Venue Detail Page**
   (`src/pages/promoter/venues/PromoterVenueDetailPage.tsx`)

   - Add "Favorite Venue" button
   - Show favorites count

3. **Show Detail Page** (`src/pages/shows/ShowDetailPage.tsx`)

   - Add RSVP button
   - Show attendance count

4. **Show Listings** (widgets, dashboard)
   - Quick RSVP buttons on cards

**Estimated Time**: 4 hours

---

### Phase 5: Update Fan Dashboard

**Modify**: `src/pages/dashboards/fan/FanDashboardContent.tsx`

Replace placeholders with real data:

- Quick Stats: Query real counts
- Upcoming Shows: Filter by user's RSVPs
- Favorite Comedians: Show user's favorites
- Recently Viewed: Use UserActivity

Remove "Coming Soon" section and replace with real widgets.

**Estimated Time**: 3 hours

---

## 📅 Implementation Timeline

### Week 1: Foundation (Data Models + Core Components)

**Days 1-2**: Schema definition and deployment

- Define all GraphQL models
- Run `amplify push`
- Test queries and mutations
- Generate TypeScript types

**Days 3-5**: Core engagement components

- FavoriteButton component
- RSVPButton component
- ProfileStats widget
- Basic hooks (useFavoriteComedian, useShowRSVP)

### Week 2: Profile Sections (Display Widgets)

**Days 6-8**: Build display widgets

- Favorite Comedians section
- Favorite Venues section
- Saved Shows section
- Shows Attended section

**Days 9-10**: Activity & Integration

- Recent Activity feed
- Integrate into Account Profile page

### Week 3: Public Profile & Polish

**Days 11-12**: Public profile page

- Create UserPublicProfilePage
- Routing and permissions
- Privacy controls

**Days 13-14**: Add buttons throughout app

- Comedian pages
- Venue pages
- Show pages
- Dashboard updates

**Day 15**: Testing & Bug Fixes

- Test all flows
- Fix edge cases
- Polish UI/UX

---

## 🎯 Success Metrics

After implementation, users should be able to:

- ✅ Follow/favorite comedians from their profile pages
- ✅ Favorite venues
- ✅ RSVP to shows ("Going", "Interested")
- ✅ Mark shows as "Attended" (manual or automatic after show date)
- ✅ See their stats (shows attended, comedians following, etc.)
- ✅ View all their favorites in one place (their profile)
- ✅ See recently viewed content
- ✅ Share their public profile with friends
- ✅ Have a real, personalized experience on the platform

---

## 🚀 Quick Start (Today)

### Option A: Start with Data Models (RECOMMENDED)

This unlocks everything else:

1. Add GraphQL schema models (30 min)
2. Run `amplify push` (15 min)
3. Create TypeScript types (auto-generated)
4. Build FavoriteButton component (2 hours)
5. Add to Comedian Detail page (30 min)
6. Test end-to-end (30 min)

**Total**: ~4 hours for first working feature

---

### Option B: Start with Profile Page Structure

Build the UI first with mock data:

1. Create UserPublicProfilePage (1 hour)
2. Create ProfileStats widget with mock data (1 hour)
3. Create Favorite Comedians section with mock data (1 hour)
4. Wire up routing (30 min)

Then go back and add real data models.

**Total**: ~3.5 hours for visual structure

---

## 💡 Recommendations

1. **Start with FavoriteComedian** - It's the simplest and highest impact
2. **Add buttons to existing pages first** - Let users start collecting
   favorites
3. **Build profile page second** - Show users their collection
4. **Add RSVP system third** - More complex but high value
5. **Reviews/Activity last** - Nice to have, but not critical

---

## 📝 Notes

- All favorites/RSVPs are private by default (only user can see)
- Public profile can have privacy settings (show/hide sections)
- Admin dashboard should show aggregate stats (total favorites, RSVPs, etc.)
- Consider notifications for show reminders (future enhancement)
- Consider recommendations based on favorites (future AI feature)

---

## 🎉 End Result

After completion, you'll have:

- A fully functional user profile system
- Real engagement features that make fans return
- Data to build recommendations later
- Foundation for social features (following, activity feeds)
- Insights into what users like (for business analytics)

**This will make OpenLaughs feel like a real, living comedy community
platform!** 🎭

---

Ready to start? I recommend: **Build the FavoriteComedian system first** - Quick
win, high impact, unlocks profile pages.
