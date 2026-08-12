-- Teacher Document Submission
-- Apply this in the Supabase Dashboard SQL Editor.
-- Safe to re-run: every statement is idempotent.

-- ---------------------------------------------------------------------------
-- 1. Submissions table
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  teacher_name text not null,
  document_type text not null,
  original_file_name text not null,
  storage_path text not null,
  file_type text not null,
  file_size bigint not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Constraints (added separately so the migration can be applied to an existing table)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'submissions_teacher_name_check') then
    alter table public.submissions
      add constraint submissions_teacher_name_check
      check (char_length(btrim(teacher_name)) between 2 and 120);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'submissions_document_type_check') then
    alter table public.submissions
      add constraint submissions_document_type_check
      check (document_type in ('OBAS', 'TRAVEL_AUTHORITY', 'FORM_6'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'submissions_file_type_check') then
    alter table public.submissions
      add constraint submissions_file_type_check
      check (file_type in ('application/pdf', 'image/jpeg', 'image/png'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'submissions_file_size_check') then
    alter table public.submissions
      add constraint submissions_file_size_check
      check (file_size > 0 and file_size <= 10485760);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'submissions_status_check') then
    alter table public.submissions
      add constraint submissions_status_check
      check (status in ('PENDING', 'REVIEWED'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'submissions_storage_path_key') then
    alter table public.submissions
      add constraint submissions_storage_path_key unique (storage_path);
  end if;
end
$$;

create index if not exists submissions_created_at_idx
  on public.submissions (created_at desc);

create index if not exists submissions_document_type_idx
  on public.submissions (document_type);

create index if not exists submissions_status_idx
  on public.submissions (status);

-- ---------------------------------------------------------------------------
-- 2. updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists submissions_set_updated_at on public.submissions;

create trigger submissions_set_updated_at
  before update on public.submissions
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
--
-- RLS is enabled and NO policy is created for the `anon` or `authenticated`
-- roles, so neither anonymous teachers nor logged-in users can read or write
-- this table directly from the browser. All access goes through the backend,
-- which uses the service-role key (service role bypasses RLS by design).
-- ---------------------------------------------------------------------------
alter table public.submissions enable row level security;

-- Explicitly drop any permissive policy that may have been created earlier.
drop policy if exists "submissions_public_read" on public.submissions;
drop policy if exists "submissions_public_insert" on public.submissions;

-- ---------------------------------------------------------------------------
-- 4. Private Storage bucket
--
-- `public = false` means no permanent public URL exists for any object;
-- files can only be fetched through short-lived signed URLs created by the
-- backend for authenticated administrators.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'teacher-documents',
  'teacher-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- 5. Storage policies
--
-- No policies are granted to `anon` or `authenticated` for this bucket, so
-- the objects are unreachable from the frontend. The service-role key used by
-- the backend bypasses storage RLS, which is what uploads/signed URLs rely on.
-- These drops only remove permissive policies for THIS bucket if they exist;
-- policies for other buckets are untouched.
-- ---------------------------------------------------------------------------
drop policy if exists "teacher_documents_public_read" on storage.objects;
drop policy if exists "teacher_documents_public_insert" on storage.objects;
