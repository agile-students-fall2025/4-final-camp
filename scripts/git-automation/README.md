# CAMP Sprint 3 - Git Automation Workflow

## Overview

This script automates the Agile workflow for Sprint 3:
- Creates GitHub issues (attached to Sprint 3 milestone)
- Creates feature branches
- Commits your assigned files
- Pushes to remote
- Creates Pull Requests

---

## Setup (One-Time)

### 1. Unzip the repo you received
```bash
unzip 4-final-camp-1.zip -d ~/projects/
cd ~/projects/4-final-camp-1
```

### 2. Set the remote to the main repo
```bash
git remote set-url origin https://github.com/agile-students-fall2025/4-final-camp.git
git fetch origin
```

### 3. Install GitHub CLI (if not already installed)
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```

### 4. Login to GitHub
```bash
gh auth login
# Follow the prompts, choose HTTPS and authenticate via browser
```

---

## Running the Workflow

### Run for YOUR files only:

```bash
node scripts/git-automation/workflow.js --member YOUR_GITHUB_USERNAME
```

### Team Member Commands:

| Member | Command |
|--------|---------|
| **Ashmit** | `node scripts/git-automation/workflow.js --member Ansester` |
| **Talal** | `node scripts/git-automation/workflow.js --member TalalNaveed` |
| **Shaf** | `node scripts/git-automation/workflow.js --member Shaf5` |
| **Akarsh** | `node scripts/git-automation/workflow.js --member Ak1016-stack` |
| **Saad** | `node scripts/git-automation/workflow.js --member saadiftikhar04` |

### Dry Run (Preview without making changes):
```bash
node scripts/git-automation/workflow.js --member YOUR_USERNAME --dry-run
```

---

## What Happens

When you run the script, it will:

1. **Create Issues** → Sprint 3 milestone, labeled "task", assigned to you
2. **Create Branch** → `feature/yourusername-category` (e.g., `feature/shaf5-staff-portal`)
3. **Commit Files** → Only your assigned files
4. **Push Branch** → To origin
5. **Create PR** → Targets `master`, auto-assigned to you

---

## File Assignments

| Member | Areas |
|--------|-------|
| **Ansester** | Auth, API services, App core, server config, documentation |
| **TalalNaveed** | Backend routes (auth, users, dashboard), models, middleware, config |
| **Shaf5** | Staff portal pages, staff/items routes |
| **Ak1016-stack** | Student pages (Home, Borrowals, Reservations), borrowals/reservations routes, components |
| **saadiftikhar04** | Fines, Payments, Landing, Profile, Filter pages, fines/payments/facilities routes |

---

## After Running

1. Go to GitHub and review your PRs
2. Review and approve other team members PRs
3. Merge PRs to master once approved

---

## Troubleshooting

### "Not a git repository"
```bash
cd ~/projects/4-final-camp-1  # Make sure you are in the right folder
```

### "gh: command not found"
Install GitHub CLI (see Setup step 3)

### "Authentication required"
```bash
gh auth login
```

### "Branch already exists"
The script will switch to the existing branch and continue

### "Nothing to commit"
Your files may already be committed. Check with `git status`

### Permission denied on scripts
```bash
chmod +x scripts/git-automation/workflow.js
```

---

## Quick Reference Card

```
+-------------------------------------------------------------+
|                CAMP Sprint 3 - PR Workflow                  |
+-------------------------------------------------------------+
|  1. cd into the unzipped repo folder                        |
|  2. Run: gh auth login (if not logged in)                   |
|  3. Run: node scripts/git-automation/workflow.js \          |
|          --member YOUR_GITHUB_USERNAME                      |
|                                                             |
|  This will automatically:                                   |
|  - Create GitHub issues (Sprint 3 milestone)                |
|  - Create feature branches                                  |
|  - Commit your assigned files                               |
|  - Push branches                                            |
|  - Create Pull Requests                                     |
+-------------------------------------------------------------+
```
