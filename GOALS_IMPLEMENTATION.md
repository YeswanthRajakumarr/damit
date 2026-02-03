# Goals Feature Implementation Guide

## Overview
Full CRUD (Create, Read, Update, Delete) functionality for user goals in the Profile page.

## Files Created/Modified

### New Files:
1. **`src/hooks/useGoals.ts`** - React Query hooks for goals CRUD operations
2. **`src/components/GoalDialog.tsx`** - Dialog component for adding/editing goals
3. **`supabase_goals_migration.sql`** - Database migration script
4. **`GOALS_IMPLEMENTATION.md`** - This file

### Modified Files:
1. **`src/pages/Profile.tsx`** - Added Goals tab with full functionality
2. **`src/pages/PublicRecords.tsx`** - Added theme toggle

## Database Setup

### Step 1: Run the Migration
You need to create the `goals` table in your Supabase database:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase_goals_migration.sql`
4. Click "Run" to execute the migration

This will create:
- `goals` table with proper structure
- Row Level Security (RLS) policies
- Indexes for performance
- Automatic `updated_at` trigger

### Step 2: Update Supabase Types (Optional but Recommended)
To get TypeScript autocomplete for the goals table:

1. Install Supabase CLI if you haven't:
   ```bash
   npm install -g supabase
   ```

2. Generate types:
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
   ```

   Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

## Features Implemented

### 1. Add Goal
- Click "Add New Goal" button
- Fill in goal details:
  - Title (e.g., "Daily Step Goal")
  - Target (e.g., "10,000 steps per day")
  - Choose from 7 icon types
  - Select color from 8 options
- Save creates the goal in database

### 2. Edit Goal
- Hover over a goal to reveal edit button
- Click edit icon
- Modify any fields
- Save updates the goal

### 3. Delete Goal
- Hover over a goal to reveal delete button
- Click delete icon (trash)
- Confirm deletion in dialog
- Goal is removed from database

### 4. View Goals
- All goals displayed with:
  - Custom icon and color
  - Title and target
  - Hover effects
  - Loading states
- Empty state when no goals exist

## UI Components

### GoalDialog Features:
- **Icon Selection**: 21 health & wellness icons to choose from
- **Color Selection**: 8 colors (Primary, Green, Amber, Blue, Purple, Rose, Cyan, Indigo)
- **Validation**: Required fields (title, target)
- **Loading States**: Disabled during save/update
- **Responsive**: Works on mobile and desktop with scrollable icon grid

### Icon Types Available (21 total):
- `target` - Target icon (default)
- `trending` - Trending Up icon
- `steps` - Footprints icon
- `sleep` - Moon icon
- `workout` - Dumbbell icon
- `water` - Glass Water icon
- `diet` - Utensils icon
- `heart` - Heart icon (cardiovascular health)
- `energy` - Zap/Lightning icon
- `mindfulness` - Brain icon (mental health)
- `nutrition` - Apple icon
- `cardio` - Bike icon
- `time` - Timer icon
- `calories` - Flame icon
- `activity` - Activity/Pulse icon
- `wellness` - Smile icon (overall wellness)
- `achievement` - Trophy icon
- `habits` - Coffee icon (daily habits)
- `learning` - Book icon (education/growth)
- `motivation` - Sparkles icon
- `morning` - Sun icon (morning routines)

### Color Options:
- `primary` - Theme primary color
- `success` - Green
- `amber-500` - Amber
- `blue-500` - Blue
- `purple-500` - Purple
- `rose-500` - Rose
- `cyan-500` - Cyan
- `indigo-500` - Indigo

## Technical Details

### Database Schema:
```sql
goals (
  id UUID PRIMARY KEY,
  user_id UUID (references auth.users),
  title TEXT,
  target TEXT,
  icon_type TEXT,
  color TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Security:
- Row Level Security (RLS) enabled
- Users can only access their own goals
- Policies for SELECT, INSERT, UPDATE, DELETE

### State Management:
- React Query for data fetching and caching
- Automatic refetching after mutations
- Optimistic updates possible
- Loading and error states handled

## Testing Checklist

- [ ] Database migration executed successfully
- [ ] Can add a new goal
- [ ] Can edit an existing goal
- [ ] Can delete a goal
- [ ] Empty state shows when no goals
- [ ] Loading states work correctly
- [ ] Icons render correctly
- [ ] Colors apply correctly
- [ ] Mobile responsive
- [ ] Dark/Light mode works
- [ ] Goal Dialog validation works
- [ ] Error handling works

## Troubleshooting

### Issue: "Table 'goals' does not exist"
**Solution**: Run the migration script in Supabase SQL Editor

### Issue: Type errors in useGoals.ts
**Solution**: Update Supabase types as described in Step 2

### Issue: RLS policy preventing operations
**Solution**: Ensure user is authenticated and policies are correctly applied

### Issue: Icons not rendering
**Solution**: Check that icon_type values match ICON_MAP keys

## Future Enhancements

Potential additions:
1. Goal progress tracking
2. Goal completion status
3. Goal categories/tags
4. Goal reminders/notifications
5. Goal analytics and insights
6. Goal sharing
7. Goal templates
8. Goal streaks
9. Goal attachments (notes, images)
10. Gamification (badges, achievements)

## Related Files

- `src/hooks/useDailyLogs.ts` - Similar pattern for reference
- `src/components/ui/dialog.tsx` - Dialog component
- `src/components/ui/alert-dialog.tsx` - Alert dialog component
- `src/integrations/supabase/client.ts` - Supabase client setup
