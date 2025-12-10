# GitHub Actions Workflows

This directory contains CI/CD workflows for the CAMP application.

## Workflows

### Continuous Integration (`ci.yml`)

Runs on every pull request and push to master:

- **Backend Tests**: Runs test suite on Node.js 18.x and 20.x
- **Frontend Build**: Lints and builds the React application
- **Integration Check**: Ensures all checks pass

**Status Badge:**
```markdown
![CI Status](https://github.com/agile-students-fall2025/4-final-camp/actions/workflows/ci.yml/badge.svg)
```

### Continuous Deployment (`cd.yml`)

Automatically deploys to Digital Ocean when code is merged to master:

- Connects to the droplet via SSH
- Pulls latest code from GitHub
- Updates backend and frontend
- Restarts services
- Verifies deployment

**Status Badge:**
```markdown
![CD Status](https://github.com/agile-students-fall2025/4-final-camp/actions/workflows/cd.yml/badge.svg)
```

## Required GitHub Secrets

To enable the CD workflow, add these secrets to your GitHub repository settings:

1. Go to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

2. Add the following secrets:

   - `DROPLET_IP`: Your Digital Ocean droplet IP address
     ```
     167.99.121.69
     ```

   - `SSH_PRIVATE_KEY`: Your SSH private key for connecting to the droplet
     ```bash
     # Get the private key content:
     cat ~/.ssh/digitalocean_rsa
     ```
     Copy the entire output including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

## Setup Instructions

1. **Add the SSH key to GitHub Secrets:**
   ```bash
   # Display your private key
   cat ~/.ssh/digitalocean_rsa
   ```
   Copy this content and add it as `SSH_PRIVATE_KEY` in GitHub Secrets.

2. **Add the droplet IP to GitHub Secrets:**
   Add `167.99.121.69` as `DROPLET_IP` in GitHub Secrets.

3. **Enable GitHub Actions:**
   - Go to your repository's `Actions` tab
   - Enable workflows if prompted

4. **Test the CI workflow:**
   - Create a pull request
   - GitHub Actions will automatically run tests and build

5. **Test the CD workflow:**
   - Merge a pull request to master
   - GitHub Actions will automatically deploy to production

## Monitoring

- View workflow runs in the `Actions` tab of your GitHub repository
- Check logs for each step of the build/deploy process
- View deployment status at: http://167.99.121.69

## Troubleshooting

### CI Failures

- Check the logs in the Actions tab
- Ensure all tests pass locally before pushing
- Verify dependencies are correctly specified in package.json

### CD Failures

- Verify SSH_PRIVATE_KEY secret is correctly set
- Ensure the droplet is accessible
- Check PM2 and nginx logs on the droplet:
  ```bash
  ssh root@167.99.121.69
  pm2 logs camp-backend
  systemctl status nginx
  ```

### Warnings Causing Build Failures

If React warnings cause the build to fail, the `CI=false` environment variable is set in the workflow to prevent this.

## Extra Credit

This setup fulfills the extra credit requirements:

✅ **Continuous Integration**: Automated testing on every pull request
✅ **Continuous Deployment**: Automated deployment to production on merge to master

## Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/agile-students-fall2025/4-final-camp/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/agile-students-fall2025/4-final-camp/actions/workflows/cd.yml/badge.svg)
```
