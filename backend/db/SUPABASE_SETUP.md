# Supabase Setup — Teacher Document Submission

These steps must be applied manually in the Supabase Dashboard. Nothing here has been
applied automatically.

## 1. Run the migration

Dashboard → **SQL Editor** → New query → paste the contents of
[`migrations/001_submissions.sql`](migrations/001_submissions.sql) → **Run**.

It creates:

| Object | Purpose |
| --- | --- |
| `public.submissions` | Submission metadata (no file binaries) |
| Check constraints | `document_type in ('OBAS','TRAVEL_AUTHORITY','FORM_6')`, `file_type in ('application/pdf','image/jpeg','image/png')`, `file_size <= 10 MB`, `status in ('PENDING','REVIEWED')` |
| Indexes | `created_at desc`, `document_type`, `status` |
| `submissions_set_updated_at` trigger | Keeps `updated_at` current |
| RLS | Enabled on `public.submissions` with **no** `anon`/`authenticated` policies |
| Storage bucket `teacher-documents` | Private (`public = false`), 10 MB limit, PDF/JPEG/PNG only |

### If the bucket statement fails

Creating a bucket from the SQL Editor can be blocked depending on project permissions.
In that case create it from the UI instead:

Dashboard → **Storage** → **New bucket**
- Name: `teacher-documents`
- Public bucket: **OFF** (must stay private)
- File size limit: `10 MB`
- Allowed MIME types: `application/pdf, image/jpeg, image/png`

Then re-run the migration; the `insert ... on conflict` becomes a no-op.

## 2. Verify security

```sql
-- Expect: rowsecurity = true
select relname, relrowsecurity from pg_class where relname = 'submissions';

-- Expect: 0 rows (no policy exposes the table to anon/authenticated)
select policyname, roles from pg_policies
where schemaname = 'public' and tablename = 'submissions';

-- Expect: public = false
select id, public from storage.buckets where id = 'teacher-documents';
```

Because RLS is on and no policy exists for `anon` / `authenticated`, the table and the
bucket are reachable only through the backend, which uses the service-role key
(service role bypasses RLS by design). The service-role key must stay in
`backend/.env` and must never be exposed to the frontend.

## 3. Backend environment variables

Add to `backend/.env` (see `backend/.env.example`):

```
SUPABASE_STORAGE_BUCKET=teacher-documents
MAX_UPLOAD_BYTES=10485760
```

Both have safe defaults in code, so existing deployments keep working without them.

## 4. Admin access

Admin authentication is unchanged: the existing `requireAdminAuth` middleware verifies
the Supabase access token and requires `user_metadata.role === 'admin'`. Both admin
submission endpoints are behind that middleware; documents are served only through
60-second signed URLs.
