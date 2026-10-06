# Supabase heartbeat

The GitHub Actions workflow in `.github/workflows/supabase-heartbeat.yml`
queries `survey_tokens` through Supabase's REST API every Monday and Thursday
at 04:17 UTC (09:47 India time). It selects at most one `id` and discards the
response. An empty table is also a successful query. It makes no data changes,
installs no dependencies, and requires no app deployment or database migration.

## Activate

1. Add these repository secrets under **Settings > Secrets and variables > Actions**:
   - `SUPABASE_URL`: the value of `NEXT_PUBLIC_SUPABASE_URL` from `.env.local`.
   - `SUPABASE_ANON_KEY`: the value of `NEXT_PUBLIC_SUPABASE_ANON_KEY` from `.env.local`.
2. Commit and push the workflow to `nextjs-migration`, the repository's current
   **default branch**. Scheduled runs only execute from the default branch.
3. Under **Actions > Supabase heartbeat**, choose **Run workflow** to verify
   connectivity. Confirm the run succeeds before relying on the schedule.

The anon key matches the app's existing database client. Its role needs SELECT
permission on `survey_tokens`; row-level security may return no visible rows,
which is fine. If a run fails due to permissions, review the existing access
policy rather than granting additional access just for this workflow. No service
role key is needed for the current setup.

## Operation and limits

- Requests have connection and execution timeouts, with up to three retries for
  transient errors. Missing secrets and HTTP failures cause a failed workflow.
- Credentials and database response bodies are not printed in workflow logs.
- GitHub may delay scheduled runs. Public repositories have scheduled workflows
  disabled automatically after 60 days without repository activity; re-enable
  the workflow if that happens and keep Actions failure notifications enabled.
- Supabase says Free projects with low activity over a seven-day period may be
  paused. This heartbeat creates periodic database activity; Supabase does not
  promise that this frequency prevents pausing. A paused project must first be
  restored through the Supabase dashboard.

References: [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
and [GitHub scheduled workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
