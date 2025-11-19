# Comedian Schema - Implementation Guide

**Date**: November 18, 2025  
**Status**: ✅ Schema Defined, Ready to Push

---

## 📊 Schema Overview

### Comedian Model (Separate Entity)

A comedian profile that exists independently from UserProfile, linked by
`userProfileId`.

**Key Design Decision**: Option A - Separate entity linked by ID

- ✅ Clean separation of concerns
- ✅ Comedians don't need to be registered users
- ✅ Promoters/Admins can create comedian profiles
- ✅ Comedians can later claim and update their profiles

---

## 🎤 Comedian Fields Breakdown

### **Core Identity** (Required)

```graphql
id: ID!                     # Auto-generated unique ID
stageName: String!          # Primary display name (REQUIRED)
bio: String                 # Biography/description
profileImageKey: String     # S3 key for profile photo
```

### **Personal Details**

```graphql
firstName: String           # Real first name (optional)
lastName: String            # Real last name (optional)
pronouns: String            # He/Him, She/Her, They/Them, etc.
```

### **Location & Status**

```graphql
basedIn: String            # Primary location (e.g., "Austin, TX")
isActive: Boolean          # Currently performing?
availability: String       # "Available", "Touring", "Booked", etc.
status: String             # "active", "inactive", "pending"
```

### **Comedy Profile**

```graphql
comedyStyles: [String]     # Array: ["Observational", "Dark", "Storytelling"]
performanceTypes: [String] # Array: ["Stand-up", "Improv", "Sketch"]
contentRating: String      # "Clean", "Adult", "NSFW", "Mixed"
yearsPerforming: Int       # Years of experience
headline: String           # One-liner tagline/catchphrase
```

### **Social Media Links**

```graphql
website: String
instagram: String          # Handle or full URL
twitter: String
tiktok: String
youtube: String
facebook: String
```

### **Professional Contact**

```graphql
businessEmail: String      # For booking inquiries
businessPhone: String      # Contact number
```

### **Career Highlights**

```graphql
notableCredits: [String]   # ["Netflix Special", "Comedy Central", etc.]
awards: [String]           # Awards and recognitions
pressKitUrl: String        # Link to EPK/press materials
videoSampleUrl: String     # Demo reel or sample video
```

### **System Fields**

```graphql
userProfileId: ID          # Link to UserProfile (if user has account)
isVerified: Boolean        # Verified badge
isFeatured: Boolean        # Featured on homepage
createdBy: String          # Email/ID of creator
```

---

## 🔐 Authorization Rules

### Who Can Do What:

**Admins:**

- ✅ Create comedians
- ✅ Update any comedian
- ✅ Delete comedians
- ✅ Read all comedians

**Promoters:**

- ✅ Create comedians
- ✅ Update any comedian
- ✅ Delete comedians
- ✅ Read all comedians

**Comedian (Owner via userProfileId):**

- ✅ Read their own profile
- ✅ Update their own profile
- ❌ Cannot delete
- ❌ Cannot create (admin/promoter creates first)

**Authenticated Users:**

- ✅ Read all comedians
- ❌ Cannot modify

**Public (Not Logged In):**

- ✅ Read all comedians
- ❌ Cannot modify

---

## 🔗 Linking Strategy

### Comedian ↔ UserProfile

**One-to-One (Optional)**

```
Comedian.userProfileId → UserProfile.id
```

**Use Cases:**

1. **Admin creates comedian profile** → `userProfileId: null` (no user account
   yet)
2. **Comedian signs up** → Admin/system links Comedian.userProfileId to
   UserProfile.id
3. **Comedian claims profile** → Updates begin syncing

### Comedian ↔ Show

**Many-to-Many via Array**

```
Show.comedianIDs: [ID] → [Comedian.id, Comedian.id, ...]
```

**Use Cases:**

1. **Single headliner** → `comedianIDs: ["comedian-123"]`
2. **Multiple acts** → `comedianIDs: ["headliner-id", "opener-id"]`
3. **Open mic** → `comedianIDs: []` (empty or many)

---

## 📋 Updated Show Schema

```graphql
type Show {
  id: ID!
  title: String!
  description: String
  dateTime: AWSDateTime!
  venueID: ID!
  comedianIDs: [ID] # ← NEW: Links to multiple comedians
  createdBy: String
  showImageKey: String
  ticketUrl: String
  ticketPrice: Float
  ageRestriction: String
}
```

---

## 🎨 Predefined Options (For UI Dropdowns)

### Comedy Styles

```typescript
const COMEDY_STYLES = [
  'Observational',
  'Dark Comedy',
  'Physical Comedy',
  'Storytelling',
  'Character Comedy',
  'Political',
  'Self-Deprecating',
  'Absurdist',
  'Musical Comedy',
  'Clean',
  'Roast',
  'Impressions',
  'Crowd Work',
];
```

### Performance Types

```typescript
const PERFORMANCE_TYPES = [
  'Stand-up',
  'Improv',
  'Sketch',
  'Character Work',
  'Musical Comedy',
  'Hosting',
  'Roasting',
];
```

### Content Ratings

```typescript
const CONTENT_RATINGS = [
  'Clean', // Family-friendly
  'PG-13', // Some adult themes
  'Adult', // Mature content
  'NSFW', // Explicit content
  'Mixed', // Varies by show
];
```

### Availability Options

```typescript
const AVAILABILITY_OPTIONS = [
  'Available for Bookings',
  'Limited Availability',
  'On Tour',
  'Not Currently Booking',
  'By Request Only',
];
```

---

## 🚀 Next Steps to Deploy

### 1. Push Schema to Amplify

```bash
amplify push
```

This will:

- Create DynamoDB table for Comedian
- Generate GraphQL API types
- Update AppSync resolvers
- Generate TypeScript types in `src/API.ts`

### 2. Generate Frontend Types

After push completes:

```bash
npm run amplify-modelgen
```

### 3. Verify Schema

Check that these files are updated:

- `src/API.ts` - TypeScript types
- `src/graphql/queries.ts` - Query definitions
- `src/graphql/mutations.ts` - Mutation definitions

---

## 💻 Frontend Implementation Plan

### Phase 1: Comedian CRUD (Admin/Promoter)

1. **Create Form** - `src/pages/comedians/ComedianCreateForm.tsx`
2. **Update Form** - `src/pages/comedians/ComedianUpdateForm.tsx`
3. **List View** - `src/pages/comedians/ComedianList.tsx`
4. **Detail Page** - `src/pages/comedians/ComedianDetailPage.tsx`

### Phase 2: Public Comedian Profiles

1. **Directory** - Browse all comedians
2. **Profile Pages** - Public-facing comedian profiles
3. **Search/Filter** - Find comedians by style, location, etc.

### Phase 3: Linking to Shows

1. **Update Show Create Form** - Add comedian selector
2. **Update Show Detail** - Display comedians
3. **Comedian Schedule** - Shows per comedian

### Phase 4: Comedian Dashboard

1. **My Profile** - Comedian can edit their own profile
2. **My Shows** - Upcoming performances
3. **Stats** - Views, followers, bookings

---

## 📝 Example Data Flow

### Scenario 1: Promoter Adds Local Comedian

1. Promoter (logged in) goes to "Add Comedian"
2. Fills in: stageName="Tony Hinchcliffe", bio="...", basedIn="Austin, TX"
3. Uploads profile photo
4. Submits → Comedian created with `userProfileId: null`
5. Tony hasn't signed up yet, but has a profile on the platform

### Scenario 2: Comedian Claims Profile

1. Tony signs up → Creates UserProfile with role='comedian'
2. Admin searches for Tony's email and links:
   - `Comedian.userProfileId = UserProfile.id`
3. Tony can now log in and edit his own Comedian profile
4. `ownerField: "userProfileId"` in auth rules allows this

### Scenario 3: Create Show with Multiple Comedians

1. Promoter creates show: "Kill Tony Live"
2. Selects comedians:
   - Tony Hinchcliffe (headliner)
   - Hans Kim (regular)
   - David Lucas (regular)
3. Show created with:
   ```json
   {
     "comedianIDs": ["tony-id", "hans-id", "david-id"]
   }
   ```
4. Show detail page queries and displays all 3 comedians

---

## 🎯 Comedian Profile Public Display

### Minimum Viable Display

```
📸 Profile Photo
🎤 Tony Hinchcliffe
📍 Austin, TX
⭐ Comedy Style: Dark Comedy, Roasting
✅ Verified

Bio: Tony Hinchcliffe is a stand-up comedian, writer, and podcast host...

Upcoming Shows: (3 shows)
Social: [Instagram] [Twitter] [YouTube]
```

### Full Profile Display

Everything above plus:

- Years Performing
- Notable Credits
- Awards
- Video Sample
- Full Show History
- Reviews/Ratings (future)

---

## 🔍 Query Examples

### Get All Comedians

```graphql
query ListComedians {
  listComedians {
    items {
      id
      stageName
      bio
      profileImageKey
      basedIn
      comedyStyles
      isVerified
    }
  }
}
```

### Get Comedian by ID

```graphql
query GetComedian($id: ID!) {
  getComedian(id: $id) {
    id
    stageName
    bio
    profileImageKey
    # ... all fields
  }
}
```

### Get Comedians for a Show

```typescript
// Frontend logic to fetch comedians for a show
const show = await getShow(showId);
const comedianIds = show.comedianIDs || [];
const comedians = await Promise.all(comedianIds.map(id => getComedian(id)));
```

---

## 🎨 UI Considerations

### Forms

- Use multi-select for comedyStyles and performanceTypes
- Image upload for profileImageKey
- URL validation for social links
- Character limit on bio (500 chars?)

### List View

- Card grid layout
- Profile photo thumbnail
- Stage name + location
- Comedy styles tags
- Verified badge

### Detail Page

- Hero section with photo
- Bio
- Stats (shows performed, followers, etc.)
- Upcoming shows
- Past shows
- Social links
- Contact (for promoters)

---

## 🔧 Migration Considerations

### If You Have Existing Shows

After deploying, you'll need to:

1. Update existing shows to add `comedianIDs: []`
2. Manually link comedians to shows (or create import script)

### Backward Compatibility

- Shows without comedianIDs will just show no comedians
- No breaking changes to existing Show queries

---

## ✅ Ready to Deploy!

When you're ready:

```bash
cd /Users/matthewgennings/Developer/OpenLaughs
amplify push
```

This will take a few minutes to:

1. Update CloudFormation stack
2. Create DynamoDB table
3. Deploy GraphQL schema
4. Generate frontend types

After deployment, we can start building the comedian management UI! 🎉
