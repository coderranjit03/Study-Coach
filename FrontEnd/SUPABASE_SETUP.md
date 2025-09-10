# Supabase Setup Instructions

## Database Setup

To connect the AuthModal to Supabase and store user data, you need to run the SQL script in your Supabase dashboard.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - In the left sidebar, click on "SQL Editor"
   - Click "New query"

3. **Run the SQL Script**
   - Copy the contents of `supabase_setup.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute the script

### What the Script Does:

1. **Creates `user_profiles` table** that complements your existing `auth.users` table:
   - `id`: Unique identifier for the profile
   - `user_id`: Links to Supabase auth.users table (UID)
   - `username`: User's chosen username (optional)
   - `email`: User's email address (optional)
   - `phone`: User's phone number (optional)
   - `display_name`: User's display name (optional)
   - `created_at`: Timestamp when profile was created
   - `updated_at`: Timestamp when profile was last updated

2. **Enables Row Level Security (RLS)** for data protection

3. **Creates policies** to ensure users can only access their own data

4. **Sets up triggers** to automatically update the `updated_at` timestamp

5. **Migrates existing users** - Syncs data from your existing `auth.users` table to the new `user_profiles` table

### Your Existing User Table Structure:
Your `auth.users` table already has these columns:
- **UID**: Unique user identifier
- **Display name**: User's display name
- **Email**: User's email address
- **Phone**: User's phone number
- **Providers**: Authentication providers (Email, Phone, etc.)
- **Provider type**: Type of authentication
- **Created at**: When user was created
- **Last sign in at**: Last sign-in timestamp

### Features:

✅ **Compatible**: Works with your existing auth.users table structure  
✅ **Secure**: Row Level Security ensures users can only access their own data  
✅ **Flexible**: Optional fields allow for both email and phone-based authentication  
✅ **Automatic**: Migrates existing users to the new profile system  
✅ **Tracked**: Timestamps track when data was created and updated  
✅ **Synced**: Automatically syncs data between auth.users and user_profiles  

### Testing:

After running the script, you can test the authentication by:
1. Opening your app
2. Clicking "Get Started" or "Try for Free"
3. Filling out the signup form with username, email, phone, and password
4. Checking your Supabase dashboard to see the new user and profile data

The AuthModal will now:
- ✅ Create Supabase auth users with email, phone, and password
- ✅ Store additional user data (username, display_name) in the `user_profiles` table
- ✅ Handle sign-in with existing users
- ✅ Show loading states and error messages
- ✅ Validate form data before submission
- ✅ Work with both email and phone-based authentication
- ✅ Sync with your existing user table structure 