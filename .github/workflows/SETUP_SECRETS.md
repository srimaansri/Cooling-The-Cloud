# GitHub Actions Setup Guide

## Setting Up Repository Secrets

To enable automated daily data fetching, you need to configure the following secrets in your GitHub repository:

### Required Secrets

1. **API Keys**
   - `EIA_API_KEY` - Your EIA API key for fetching electricity data
   - `BLS_API_KEY` - Your BLS API key for water price index (optional but recommended)

2. **Database Credentials (Supabase)**
   - `PG_HOST` - Your Supabase database host (e.g., `aws-0-us-west-1.pooler.supabase.com`)
   - `PG_USER` - Database username
   - `PG_PASSWORD` - Database password
   - `PG_DB` - Database name (usually `postgres`)
   - `PG_PORT` - Database port (usually `5432` for Supabase)
   - `PG_SSLMODE` - SSL mode (usually `require` for Supabase)

### How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret one by one:
   - **Name**: Enter the secret name exactly as shown above
   - **Value**: Enter the corresponding value from your `.env` file

### Testing the Workflow

Once secrets are configured:

1. Go to the **Actions** tab in your repository
2. Click on "Daily Data Fetch" workflow
3. Click **Run workflow** → **Run workflow** to test manually
4. Check the workflow logs to ensure everything runs correctly

### Workflow Schedule

The workflow is configured to run:
- **Automatically**: Every day at 6 AM UTC (11 PM Arizona time)
- **Manually**: You can trigger it anytime from the Actions tab

### Data Fetching Strategy

Each run fetches:
- **EIA Interchange Data**: Last 2 days (to handle any delayed reporting)
- **EIA Price Data**: Current month (prices are monthly)
- **BLS Water Index**: Last 3 months (to ensure we have the latest index)

### Monitoring

- Check the Actions tab regularly to ensure the workflow is running successfully
- Failed steps use `continue-on-error: true` so one failure won't stop other data fetches
- The workflow creates a summary report at the end showing what was fetched

### Troubleshooting

If the workflow fails:
1. Check the workflow logs in the Actions tab
2. Verify all secrets are correctly set
3. Ensure your Supabase database is not paused
4. Check that API keys are valid and not expired

### Cost Considerations

- GitHub Actions provides 2,000 free minutes per month for public repos
- This workflow uses approximately 2-3 minutes per run
- Daily runs = ~60-90 minutes per month (well within free tier)