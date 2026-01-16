# Public Share Token System - Migration Guide

## Overview
This migration adds a secure, token-based public sharing system with expiring links and the ability to regenerate/revoke access.

## Features
- **Expiring Links**: Share links expire after a configurable period (7, 30, 90, or 365 days)
- **Link Regeneration**: Users can generate new tokens, invalidating old ones
- **Easy Revocation**: Disable sharing at any time to invalidate all links
- **Secure Access**: Tokens are random 32-character strings, not user IDs

## Database Migration

### Running the Migration

1. **Via Supabase Dashboard** (Recommended):
   - Go to your Supabase project dashboard
   - Navigate to **SQL Editor**
   - Copy the contents of `supabase/migrations/20260116140938_add_public_share_tokens.sql`
   - Paste and run the SQL

2. **Via Supabase CLI**:
   ```bash
   supabase db push
   ```

### What the Migration Does

1. Adds three new columns to the `profiles` table:
   - `share_token` (TEXT): Random 32-character token
   - `share_token_expires_at` (TIMESTAMPTZ): Expiration timestamp
   - `share_enabled` (BOOLEAN): Whether sharing is currently enabled

2. Creates helper functions:
   - `generate_share_token()`: Generates a random 32-character token
   - `regenerate_share_token(user_id, expiry_days)`: Creates/updates a share token
   - `disable_sharing(user_id)`: Disables sharing and clears tokens

3. Updates RLS policies:
   - Profiles are viewable only if sharing is enabled and token hasn't expired
   - Daily logs are viewable only if the user's profile allows sharing

## How It Works

### For Users

1. **Generate a Share Link**:
   - Go to Profile page
   - Select expiry duration (7, 30, 90, or 365 days)
   - Click "Generate Share Link"
   - Copy the link to share

2. **Regenerate Link**:
   - Click the refresh icon to generate a new token
   - Old link becomes invalid immediately

3. **Disable Sharing**:
   - Click the X button to disable sharing
   - All links become invalid

### URL Format

**Old Format** (insecure):
```
https://damit.vercel.app/p/550e8400-e29b-41d4-a916-446655440000
```

**New Format** (secure):
```
https://damit.vercel.app/p/a7B3kL9mN2pQ5rS8tU1vW4xY6zA0bC2d
```

### Error Handling

The system provides specific error messages for:
- **Expired Links**: "This share link has expired. Please ask the owner to generate a new link."
- **Disabled Sharing**: "The owner has disabled public sharing for this profile."
- **Invalid Links**: "The link you're trying to access is invalid or no longer exists."

## Components Added

1. **`usePublicShare` Hook** (`src/hooks/usePublicShare.ts`):
   - `generateShareLink(expiryDays)`: Generate new token
   - `disableSharing()`: Disable sharing
   - `getCurrentShareToken()`: Get current token status

2. **`ShareManagement` Component** (`src/components/ShareManagement.tsx`):
   - UI for managing share links
   - Shows active link with expiry status
   - Copy, regenerate, and disable buttons

3. **Updated `PublicRecords` Page**:
   - Now uses `shareToken` instead of `userId`
   - Better error handling for expired/invalid links

## Security Improvements

✅ **Before**: Anyone could guess user IDs and access profiles  
✅ **After**: 32-character random tokens are nearly impossible to guess

✅ **Before**: Links never expired  
✅ **After**: Links expire after chosen duration

✅ **Before**: No way to revoke access  
✅ **After**: Users can disable sharing or regenerate tokens anytime

## Testing

1. **Generate a Link**:
   - Go to Profile page
   - Generate a 7-day link
   - Copy and open in incognito window

2. **Test Expiration**:
   - In database, manually set `share_token_expires_at` to past date
   - Try accessing the link - should show "Link Expired"

3. **Test Regeneration**:
   - Generate a link and copy it
   - Click regenerate
   - Try the old link - should be invalid
   - Try the new link - should work

4. **Test Disable**:
   - Generate a link
   - Click disable
   - Try the link - should show "Sharing Disabled"

## TypeScript Errors

The TypeScript errors you're seeing are expected and will resolve once the migration is run. They occur because:
- The database columns don't exist yet in your local/development environment
- Supabase's type generation hasn't picked up the new columns

After running the migration, regenerate Supabase types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Remove columns
ALTER TABLE profiles
DROP COLUMN IF EXISTS share_token,
DROP COLUMN IF EXISTS share_token_expires_at,
DROP COLUMN IF EXISTS share_enabled;

-- Drop functions
DROP FUNCTION IF EXISTS generate_share_token();
DROP FUNCTION IF EXISTS regenerate_share_token(UUID, INTEGER);
DROP FUNCTION IF EXISTS disable_sharing(UUID);

-- Restore old RLS policies (if needed)
-- Add your previous RLS policies here
```

## Next Steps

1. Run the migration in your Supabase project
2. Test the new sharing functionality
3. Update any existing share links (they'll need to be regenerated)
4. Consider adding analytics to track link usage

---

**Questions or Issues?**
- Check Supabase logs for any migration errors
- Ensure RLS is enabled on the `profiles` table
- Verify that the functions have `SECURITY DEFINER` set correctly
