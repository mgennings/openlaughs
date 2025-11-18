# Dashboard Switcher - Quick Guide

**Added**: November 18, 2025  
**Status**: ✅ Ready to Use

---

## What It Does

A dropdown button in the toolbar that lets you **instantly switch between different dashboard views** without changing your actual user role in the database!

Perfect for:
- 🧪 Testing different user experiences
- 👀 Demoing the platform to others
- 🔍 Checking how features look across different roles
- 🎨 Designing/iterating on dashboards

---

## Where to Find It

Look for the dropdown button in the **top-right toolbar** that shows your current dashboard view:

- **Admin View** 🔧 (if you're admin)
- **Fan View** ❤️
- **Comedian View** 🎤
- **Promoter View** 📈

---

## How to Use It

### 1. Click the Dashboard Dropdown
Click the button that says "[Your Current View]" with a down arrow.

### 2. Select a Different View
Choose any of the 4 available dashboard views:
- **Fan View** - Comedy discovery & favorites
- **Comedian View** - Performance & bookings (shows fan view for now)
- **Promoter View** - Venue & show management
- **Admin View** - Platform management

### 3. Page Reloads Automatically
The page will reload and show you that dashboard view!

### 4. Reset to Your Actual Role
Click "Reset to My Role" at the bottom of the dropdown to go back to your real user role's dashboard.

---

## Technical Details

### How It Works
- Stores the view preference in `sessionStorage` (persists during browser session)
- The `DefaultPage` component checks for the override and routes accordingly
- Your actual database role **never changes**
- Closing the browser/tab clears the override

### Session Storage Key
```typescript
sessionStorage.getItem('dashboard-view-override'); // 'fan' | 'comedian' | 'promoter' | 'admin'
```

### Persistence
- ✅ Persists across page navigation
- ✅ Persists on page reload
- ❌ Cleared when browser tab/window is closed
- ❌ Cleared when you click "Reset to My Role"

---

## Dashboard View Differences

### 🎭 Fan View
**Focus**: Discovery & Engagement
- Welcome banner
- Quick stats (shows attended, following, etc.)
- Upcoming shows widget
- "Coming Soon" features preview

### 🎤 Comedian View
**Focus**: Career Management *(Currently shows Fan View as placeholder)*
- Will show: Performance stats, bookings, upcoming shows
- TODO: Build comedian-specific dashboard

### 📈 Promoter View
**Focus**: Business Management
- Channel stats (social media)
- Highlights
- Earnings chart
- Team meetings
- Shows management

### ⚙️ Admin View
**Focus**: Platform Management
- **Platform Statistics** (new!)
  - Total users, shows, venues
  - User breakdown by role
- All promoter widgets
- System-wide visibility

---

## Where It's Available

The Dashboard Switcher appears in the toolbar on:
- ✅ Admin Dashboard (`Demo1LightSidebarPage`)
- ✅ Fan Dashboard (`FanDashboardPage`)
- ⏳ Comedian Dashboard (when built)
- ⏳ Promoter Dashboard (can add easily)

---

## Quick Test Scenarios

### Test 1: Admin → Fan Switch
1. You're logged in as admin
2. Click dashboard dropdown
3. Select "Fan View"
4. Page reloads showing fan experience
5. Click dropdown again → "Reset to My Role (admin)"

### Test 2: Browse as Different Roles
1. Switch to Fan view
2. Navigate to Shows page
3. Switch to Admin view
4. Notice the different perspective/capabilities
5. Switch to Promoter view
6. See business-focused interface

### Test 3: Session Persistence
1. Switch to Fan view
2. Navigate to different pages
3. Come back to dashboard
4. Still in Fan view!
5. Close browser tab
6. Open new tab → Back to your real role

---

## Future Enhancements

### Possible Improvements
- [ ] Add visual indicator banner showing "Viewing as: Fan" when override is active
- [ ] Add keyboard shortcut to cycle through views (Cmd+Shift+D?)
- [ ] Show role-specific menu items in sidebar based on view
- [ ] Add "Switch View" option in user profile dropdown
- [ ] Remember last used view override preference

### Security Considerations
- View override is **client-side only** (sessionStorage)
- Backend permissions are still based on **actual user role**
- Can't perform actions you don't have permission for
- Safe for testing and demos

---

## Troubleshooting

### Dropdown Doesn't Show
- Make sure you're on a page with the toolbar (dashboard pages)
- Check browser console for errors

### Switch Doesn't Work
- Check browser console for errors
- Try clearing sessionStorage: `sessionStorage.clear()`
- Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)

### Stuck in Wrong View
- Click "Reset to My Role" in the dropdown
- Or manually clear: `sessionStorage.removeItem('dashboard-view-override')`

### See Same Dashboard After Switch
- Some roles currently share dashboards (Comedian shows Fan for now)
- This is expected until all role-specific dashboards are built

---

## Code Reference

**Component**: `src/components/dashboard-switcher/DashboardSwitcher.tsx`
**Integration**: 
- `src/pages/dashboards/default/DefaultPage.tsx` (routing logic)
- `src/pages/dashboards/demo1/light-sidebar/Demo1LightSidebarPage.tsx` (admin toolbar)
- `src/pages/dashboards/fan/FanDashboardPage.tsx` (fan toolbar)

---

## Try It Now! 🚀

**Refresh your dashboard** and look for the dropdown button in the top-right toolbar. Click it and explore the different views!

You can now easily test and demo all the different user experiences without touching the database. Perfect for development and showing off the platform! 🎉

