# Comedian Data Architecture - Key Considerations

**Date**: November 18, 2025

---

## 🎯 Calculated vs Stored Data

### ✅ Changed: `yearsPerforming` → `performingSince`

**Old Approach (Bad):**

```graphql
yearsPerforming: Int  # Static value, becomes outdated
```

**New Approach (Good):**

```graphql
performingSince: Int  # Store year started (e.g., 2015)
```

**Frontend Calculation:**

```typescript
const yearsPerforming = new Date().getFullYear() - comedian.performingSince;
// 2025 - 2015 = 10 years
```

**Benefits:**

- ✅ Always accurate
- ✅ No manual updates needed
- ✅ Automatically increments each year
- ✅ Simple to display: "Performing since 2015 (10 years)"

---

## 📊 Other Data Considerations

### 1. **Age / Birthdate** (If We Add It)

**Don't Store:**

```graphql
age: Int  # ❌ Becomes outdated
```

**Do Store:**

```graphql
birthdate: AWSDate  # ✅ Calculate age dynamically
```

**Frontend:**

```typescript
const age = calculateAge(comedian.birthdate);
```

**Privacy Note:** Birthdate is sensitive. Consider:

- Store in UserProfile (private)
- Only show age range publicly ("30s", "40s")
- Or don't show at all

---

### 2. **Show Count / Statistics**

**Don't Store:**

```graphql
totalShows: Int       # ❌ Out of sync with actual shows
upcomingShows: Int    # ❌ Needs constant updates
```

**Do Calculate:**

```typescript
// Query shows where comedian ID is in comedianIDs array
const shows = await listShows({
  filter: {
    comedianIDs: { contains: comedianId },
  },
});

const totalShows = shows.length;
const upcomingShows = shows.filter(
  s => new Date(s.dateTime) > new Date(),
).length;
const pastShows = shows.filter(s => new Date(s.dateTime) <= new Date()).length;
```

**Consider Caching:** For heavy traffic, cache these in:

- Lambda layer
- Redis/ElastiCache
- DynamoDB GSI with aggregates

---

### 3. **Social Media Follower Counts**

**Don't Store:**

```graphql
instagramFollowers: Int  # ❌ Outdated immediately
twitterFollowers: Int    # ❌ Requires manual updates
```

**Options:**

**Option A:** Don't show counts (just links)

```typescript
// Just show the links, let users click to see followers
instagram: 'https://instagram.com/tonyhinchcliffe';
```

**Option B:** Fetch real-time (if using APIs)

```typescript
// Fetch from Instagram Graph API, Twitter API, etc.
// Cache for 24 hours to avoid rate limits
```

**Option C:** Store but update periodically via Lambda

```graphql
instagramFollowers: Int
instagramFollowersUpdatedAt: AWSDateTime
```

```typescript
// Lambda runs nightly, updates follower counts via API
```

**Recommendation:** Option A (just links) - simplest and most reliable

---

### 4. **Profile Views / Popularity**

**Don't Store Directly in Comedian:**

```graphql
profileViews: Int  # ❌ Concurrency issues, hot partition
```

**Do Track Separately:**

**Option A:** Analytics service (Recommended)

- Google Analytics
- Mixpanel
- Custom analytics Lambda

**Option B:** Separate DynamoDB table

```graphql
type ComedianView @model {
  id: ID!
  comedianId: ID!
  viewedAt: AWSDateTime!
  userId: String
  sessionId: String
}
```

Then query/aggregate when needed:

```typescript
const views = await listComedianViews({
  filter: { comedianId: { eq: comedianId } },
});
const totalViews = views.items.length;
```

---

### 5. **Reviews / Ratings**

**Don't Store in Comedian:**

```graphql
averageRating: Float  # ❌ Out of sync
totalReviews: Int     # ❌ Needs constant updates
```

**Do Store in Separate Table:**

```graphql
type ComedianReview @model {
  id: ID!
  comedianId: ID!
  userId: ID!
  rating: Float!
  comment: String
  showId: ID
  createdAt: AWSDateTime!
}
```

**Calculate on Query:**

```typescript
const reviews = await listComedianReviews({
  filter: { comedianId: { eq: comedianId } },
});

const averageRating =
  reviews.items.reduce((sum, r) => sum + r.rating, 0) / reviews.items.length;
const totalReviews = reviews.items.length;
```

**Performance Optimization:** Consider caching aggregates:

```graphql
type ComedianStats @model {
  comedianId: ID! @primaryKey
  averageRating: Float
  totalReviews: Int
  totalShows: Int
  profileViews: Int
  lastUpdated: AWSDateTime!
}
```

Update via Lambda trigger when reviews/shows are created.

---

### 6. **Featured/Trending Status**

**Manual Flags (Admin Control):**

```graphql
isFeatured: Boolean   # ✅ Admin sets manually
isVerified: Boolean   # ✅ Admin verification
```

**Calculated Rankings:**

```typescript
// Calculate "trending" based on recent activity
const trendingComedians = comedians.sort((a, b) => {
  const aScore = getRecentActivity(a); // shows, views, bookings
  const bScore = getRecentActivity(b);
  return bScore - aScore;
});
```

---

### 7. **Booking/Availability Status**

**Semi-Manual (Comedian Updates):**

```graphql
availability: String  # ✅ Comedian sets: "Available", "Booked", "On Tour"
isActive: Boolean     # ✅ Admin or comedian sets
```

**Could Be Calculated:**

```typescript
// Check if comedian has shows in next 30 days
const upcomingShows = await getComedianUpcomingShows(comedianId);
const availability = upcomingShows.length > 10 ? 'Heavily Booked' : 'Available';
```

But manual override is better - comedian knows their schedule best.

---

## 🏗️ Architecture Patterns

### Pattern 1: Store Source Data, Calculate Display

```typescript
// Store:
performingSince: 2015;

// Calculate on display:
const yearsPerforming = currentYear - performingSince;
const displayText = `${yearsPerforming} years experience`;
```

### Pattern 2: Event-Driven Aggregation

```typescript
// When Show is created with comedianID:
// → Lambda trigger updates ComedianStats
// → Increment totalShows
// → Update lastPerformance date
```

### Pattern 3: Cached Calculations

```typescript
// Calculate expensive stats on-demand
// Cache in Redis/ElastiCache for 1 hour
// Invalidate cache when source data changes
```

---

## 📝 Recommended Schema Changes Summary

### Changed:

- ✅ `yearsPerforming: Int` → `performingSince: Int`

### Don't Add (Calculate Instead):

- ❌ `totalShows` - Query from Shows
- ❌ `upcomingShows` - Query from Shows
- ❌ `age` - Calculate from birthdate (if we add it)
- ❌ `socialFollowers` - Just show links or fetch real-time
- ❌ `profileViews` - Track in analytics or separate table
- ❌ `averageRating` - Calculate from Reviews table

### Keep as Manual Flags:

- ✅ `isFeatured` - Admin control
- ✅ `isVerified` - Admin verification
- ✅ `isActive` - Comedian/Admin sets
- ✅ `availability` - Comedian sets

---

## 🚀 Future Optimizations

### When You Need Performance:

**Create a Stats Table:**

```graphql
type ComedianStats @model {
  comedianId: ID! @primaryKey
  totalShows: Int
  upcomingShows: Int
  pastShows: Int
  averageRating: Float
  totalReviews: Int
  profileViews: Int
  lastPerformance: AWSDateTime
  nextPerformance: AWSDateTime
  updatedAt: AWSDateTime!
}
```

**Update via Lambda Triggers:**

- When Show created → Update totalShows, upcomingShows
- When Show dateTime passes → Move from upcoming to past
- When Review created → Recalculate averageRating
- Daily cron → Update profileViews from analytics

**Query Pattern:**

```typescript
// Fast read - single query
const stats = await getComedianStats(comedianId);

// Display immediately
return {
  totalShows: stats.totalShows,
  rating: stats.averageRating,
  // ...
};
```

---

## 💡 Best Practices

### 1. **Start Simple, Optimize Later**

- Begin with calculated values
- Add caching/stats table when you have performance issues
- Don't over-engineer early

### 2. **Single Source of Truth**

- Store raw data once
- Calculate/aggregate as needed
- Avoid duplicate storage

### 3. **Consider Read vs Write Patterns**

- High reads, low writes → Cache aggressively
- High writes → Calculate on demand
- Real-time needs → WebSocket updates

### 4. **Privacy & Permissions**

- Sensitive data (birthdate, contact) → Private fields
- Public stats (shows, ratings) → Public reads
- Admin-only flags (isVerified, isFeatured) → Admin writes

---

## 📊 Summary Table

| Data Point       | Storage                  | Calculation                     | Notes                   |
| ---------------- | ------------------------ | ------------------------------- | ----------------------- |
| Years Performing | `performingSince: Int`   | `currentYear - performingSince` | ✅ Always accurate      |
| Age              | `birthdate: AWSDate`     | `calculateAge(birthdate)`       | Consider privacy        |
| Total Shows      | -                        | Query Shows table               | Or cache in stats table |
| Average Rating   | -                        | Query Reviews, calculate        | Or cache in stats table |
| Profile Views    | Separate table/analytics | Aggregate on query              | Cache for performance   |
| Social Followers | External API or none     | Fetch real-time (optional)      | Just show links         |
| Featured Status  | `isFeatured: Boolean`    | Manual admin flag               | ✅ Admin control        |
| Verified         | `isVerified: Boolean`    | Manual admin flag               | ✅ Admin control        |
| Availability     | `availability: String`   | Comedian sets manually          | Or calculate from shows |

---

## ✅ Current Schema (After Changes)

```graphql
type Comedian @model {
  id: ID!
  stageName: String!
  bio: String
  profileImageKey: String
  firstName: String
  lastName: String
  pronouns: String
  basedIn: String
  isActive: Boolean
  availability: String
  comedyStyles: [String]
  performanceTypes: [String]
  contentRating: String
  performingSince: Int # ← Changed from yearsPerforming
  headline: String
  website: String
  instagram: String
  twitter: String
  tiktok: String
  youtube: String
  facebook: String
  businessEmail: String
  businessPhone: String
  notableCredits: [String]
  awards: [String]
  pressKitUrl: String
  videoSampleUrl: String
  userProfileId: ID
  isVerified: Boolean
  isFeatured: Boolean
  status: String
  createdBy: String
}
```

**Frontend Display:**

```typescript
const yearsExperience = new Date().getFullYear() - comedian.performingSince;
// "Performing since 2015 (10 years)"
```

Perfect architecture for maintainable, accurate data! 🎉
