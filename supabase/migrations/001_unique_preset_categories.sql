-- Prevent duplicate preset categories per user.
-- Run this once in the Supabase SQL Editor.

create unique index if not exists categories_user_preset_name_uniq
  on categories(user_id, name)
  where is_preset = true;
