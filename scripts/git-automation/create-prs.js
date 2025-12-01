#!/usr/bin/env node

/**
 * CAMP Project - Create Branches and PRs for Existing Issues
 * 
 * This script:
 * 1. Fetches existing open issues assigned to the member from Sprint 3 milestone
 * 2. Matches issues to local file changes
 * 3. For each matched issue: creates branch, commits files, pushes, creates PR
 * 
 * Usage: node create-prs.js --member <username> [--dry-run] [--yes]
 * 
 * Prerequisites:
 * - Issues already exist in GitHub (Sprint 3 milestone)
 * - Local file changes ready to commit
 * - GitHub CLI authenticated
 */

const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

const REPO = 'agile-students-fall2025/4-final-camp';
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SPRINT_MILESTONE = 4; // Sprint 3 milestone number

// Safety limits
const MAX_TASKS_PER_RUN = 20;
const RATE_LIMIT_MS = 5000; // 5 seconds between API calls
const VALID_MEMBERS = ['Ansester', 'TalalNaveed', 'Shaf5', 'Ak1016-stack', 'saadiftikhar04'];

// Member GitHub info for commit authorship
const MEMBER_INFO = {
  'Ansester': { name: 'Ansester', email: 'ashmit1308@gmail.com' },
  'TalalNaveed': { name: 'TalalNaveed', email: 'talalnaveed@nyu.edu' },
  'Shaf5': { name: 'Shaf5', email: 'shaf5@nyu.edu' },
  'Ak1016-stack': { name: 'Ak1016-stack', email: 'ak1016@nyu.edu' },
  'saadiftikhar04': { name: 'saadiftikhar04', email: 'saadiftikhar04@nyu.edu' }
};

// Map issue titles to file paths
const ISSUE_TO_FILE_MAP = {
  // Frontend Core
  'Refactor App.jsx routing and layout structure': 'front-end/src/App.jsx',
  'Update index.jsx with AuthProvider wrapper': 'front-end/src/index.jsx',
  'Enhance useApiData hook error handling': 'front-end/src/hooks/useApiData.js',
  'Add new API endpoints and error handling': 'front-end/src/services/api.js',
  'Improve auth utilities with token management': 'front-end/src/utils/auth.js',
  'Add AuthContext for global auth state': 'front-end/src/context/',
  'Add reusable UI components': 'front-end/src/components/',
  
  // Student Pages
  'Update HomePage with improved dashboard layout': 'front-end/src/pages/HomePage.jsx',
  'Refactor landing page UI components': 'front-end/src/pages/landingpage.jsx',
  'Improve student login form validation': 'front-end/src/pages/StudentLoginPage.jsx',
  'Enhance student registration with validation': 'front-end/src/pages/StudentRegisterPage.jsx',
  'Add profile settings and preferences': 'front-end/src/pages/ProfileAndSettingsPage.jsx',
  'Improve catalogue browsing experience': 'front-end/src/pages/BrowserCataloguePage.jsx',
  'Update facility items display': 'front-end/src/pages/FacilityItemsPage.jsx',
  'Enhance search and filter functionality': 'front-end/src/pages/FilterAndSearchPage.jsx',
  'Improve item detail view and actions': 'front-end/src/pages/ItemDetailPage.jsx',
  'Update my borrowals list display': 'front-end/src/pages/MyBorrowalsPage.jsx',
  'Add my reservations page': 'front-end/src/pages/MyReservationsPage.jsx',
  'Improve reservation date/time picker': 'front-end/src/pages/ReserveDateTimePage.jsx',
  'Update reservation confirmation display': 'front-end/src/pages/ReservationConfirmedPage.jsx',
  'Improve notifications display': 'front-end/src/pages/NotificationsPage.jsx',
  'Update waitlist confirmation page': 'front-end/src/pages/WaitlistConfirmedPage.jsx',
  'Update help and policies content': 'front-end/src/pages/HelpAndPoliciesPage.jsx',
  
  // Fines & Payments
  'Enhance fines display with payment options': 'front-end/src/pages/FinesPage.jsx',
  'Improve fine payment flow': 'front-end/src/pages/PayFinePage.jsx',
  'Update payment history display': 'front-end/src/pages/PaymentHistoryPage.jsx',
  'Add payment success confirmation': 'front-end/src/pages/PaymentSuccessPage.jsx',
  
  // Staff Pages
  'Refactor staff dashboard metrics': 'front-end/src/pages/staff/StaffDashboard.jsx',
  'Improve staff login authentication': 'front-end/src/pages/staff/StaffLoginPage.jsx',
  'Enhance inventory management table': 'front-end/src/pages/staff/Inventory.jsx',
  'Improve add item form validation': 'front-end/src/pages/staff/AddItem.jsx',
  'Enhance edit item functionality': 'front-end/src/pages/staff/EditItem.jsx',
  'Improve check-in workflow': 'front-end/src/pages/staff/CheckIn.jsx',
  'Enhance check-out process': 'front-end/src/pages/staff/CheckOut.jsx',
  'Add checkout success page': 'front-end/src/pages/staff/CheckoutSuccess.jsx',
  'Update overdue items display': 'front-end/src/pages/staff/Overdue.jsx',
  'Improve reservations management': 'front-end/src/pages/staff/Reservations.jsx',
  'Enhance fines management with cash payments': 'front-end/src/pages/staff/ManageFines.jsx',
  'Remove deprecated AutomatedAlerts component': 'front-end/src/pages/staff/AutomatedAlerts.jsx',
  
  // Backend Routes
  'Implement JWT authentication routes': 'back-end/routes/auth.js',
  'Update user management routes': 'back-end/routes/users.js',
  'Enhance items API endpoints': 'back-end/routes/items.js',
  'Improve borrowals API routes': 'back-end/routes/borrowals.js',
  'Update reservations API endpoints': 'back-end/routes/reservations.js',
  'Improve waitlist API functionality': 'back-end/routes/waitlist.js',
  'Enhance fines API with cash payments': 'back-end/routes/fines.js',
  'Add payment processing routes': 'back-end/routes/payments.js',
  'Update staff management routes': 'back-end/routes/staff.js',
  'Improve facilities API endpoints': 'back-end/routes/facilities.js',
  'Update dashboard statistics routes': 'back-end/routes/dashboard.js',
  'Enhance notifications API': 'back-end/routes/notifications.js',
  'Update policies API endpoints': 'back-end/routes/policies.js',
  'Improve help API routes': 'back-end/routes/help.js',
  'Update alerts API endpoints': 'back-end/routes/alerts.js',
  
  // Backend Core
  'Update Express app configuration': 'back-end/app.js',
  'Improve server startup and MongoDB connection': 'back-end/server.js',
  'Update backend dependencies': 'back-end/package.json',
  
  // Config & Docs
  'Update HTML template metadata': 'front-end/public/index.html',
  'Update webpack configuration': 'front-end/webpack.config.cjs',
  'Add task issue template': '.github/ISSUE_TEMPLATE/task.yml',
  'Add user story issue template': '.github/ISSUE_TEMPLATE/user-story.yml',
  'Add database schema documentation': 'back-end/SCHEMA.md',
  'Add automation scripts': 'scripts/'
};

// User Story numbers for branch naming
const TITLE_TO_USER_STORY = {
  'Refactor App.jsx routing and layout structure': 43,
  'Update index.jsx with AuthProvider wrapper': 88,
  'Enhance useApiData hook error handling': 43,
  'Add new API endpoints and error handling': 43,
  'Improve auth utilities with token management': 88,
  'Add AuthContext for global auth state': 88,
  'Add reusable UI components': 43,
  'Update HomePage with improved dashboard layout': 17,
  'Refactor landing page UI components': 43,
  'Improve student login form validation': 88,
  'Enhance student registration with validation': 88,
  'Add profile settings and preferences': 88,
  'Improve catalogue browsing experience': 123,
  'Update facility items display': 123,
  'Enhance search and filter functionality': 123,
  'Improve item detail view and actions': 120,
  'Update my borrowals list display': 17,
  'Add my reservations page': 138,
  'Improve reservation date/time picker': 138,
  'Update reservation confirmation display': 138,
  'Improve notifications display': 29,
  'Update waitlist confirmation page': 113,
  'Update help and policies content': 112,
  'Enhance fines display with payment options': 134,
  'Improve fine payment flow': 22,
  'Update payment history display': 133,
  'Add payment success confirmation': 119,
  'Refactor staff dashboard metrics': 31,
  'Improve staff login authentication': 23,
  'Enhance inventory management table': 31,
  'Improve add item form validation': 24,
  'Enhance edit item functionality': 35,
  'Improve check-in workflow': 26,
  'Enhance check-out process': 25,
  'Add checkout success page': 25,
  'Update overdue items display': 28,
  'Improve reservations management': 27,
  'Enhance fines management with cash payments': 30,
  'Remove deprecated AutomatedAlerts component': 29,
  'Implement JWT authentication routes': 88,
  'Update user management routes': 88,
  'Enhance items API endpoints': 123,
  'Improve borrowals API routes': 17,
  'Update reservations API endpoints': 138,
  'Improve waitlist API functionality': 113,
  'Enhance fines API with cash payments': 134,
  'Add payment processing routes': 22,
  'Update staff management routes': 31,
  'Improve facilities API endpoints': 123,
  'Update dashboard statistics routes': 31,
  'Enhance notifications API': 29,
  'Update policies API endpoints': 112,
  'Improve help API routes': 112,
  'Update alerts API endpoints': 29,
  'Update Express app configuration': 43,
  'Improve server startup and MongoDB connection': 43,
  'Update backend dependencies': 43,
  'Update HTML template metadata': 43,
  'Update webpack configuration': 43,
  'Add task issue template': 43,
  'Add user story issue template': 43,
  'Add database schema documentation': 43,
  'Add automation scripts': 43
};

// Parse arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const AUTO_YES = args.includes('--yes') || args.includes('-y');
const memberIdx = args.indexOf('--member');
const SPECIFIC_MEMBER = memberIdx !== -1 ? args[memberIdx + 1] : null;

// Colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, msg) {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function askQuestion(question) {
  if (AUTO_YES) return Promise.resolve('y');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function execSilent(cmd) {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (e) {
    return '';
  }
}

// Extract task title from issue title (remove [TASK] prefix)
function extractTaskTitle(issueTitle) {
  return issueTitle.replace(/^\[TASK\]\s*/i, '').trim();
}

// Main workflow
async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║     CAMP Project - Create Branches & PRs for Existing Issues   ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');

  // Validate member
  if (!SPECIFIC_MEMBER) {
    log('red', '❌ ERROR: --member flag is required!');
    console.log('\nUsage: node create-prs.js --member YOUR_GITHUB_USERNAME [--dry-run] [--yes]');
    console.log('\nValid members:');
    VALID_MEMBERS.forEach(m => console.log(`  - ${m}`));
    process.exit(1);
  }

  if (!VALID_MEMBERS.includes(SPECIFIC_MEMBER)) {
    log('red', `❌ ERROR: "${SPECIFIC_MEMBER}" is not a valid team member!`);
    console.log('\nValid members:');
    VALID_MEMBERS.forEach(m => console.log(`  - ${m}`));
    process.exit(1);
  }

  log('green', `✅ Running for member: ${SPECIFIC_MEMBER}`);
  if (DRY_RUN) log('yellow', '🔍 DRY RUN MODE - No changes will be made');
  console.log('');

  // Verify GitHub CLI
  log('blue', '🔐 Verifying GitHub authentication...');
  const ghUser = execSilent('gh auth status 2>&1');
  if (!ghUser.includes('Logged in')) {
    log('red', '❌ ERROR: Not logged into GitHub CLI! Run: gh auth login');
    process.exit(1);
  }
  log('green', '   ✓ GitHub CLI authenticated\n');

  // Detect default branch
  let DEFAULT_BRANCH = execSilent('git symbolic-ref --quiet --short refs/remotes/origin/HEAD').replace('origin/', '');
  if (!DEFAULT_BRANCH) {
    DEFAULT_BRANCH = execSilent('git rev-parse --verify --quiet refs/heads/main') ? 'main' : 'master';
  }
  console.log(`   Default branch: ${DEFAULT_BRANCH}\n`);

  // Step 1: Fetch open issues for this member from Sprint 3
  log('blue', '📋 Step 1: Fetching your assigned issues from Sprint 3...');
  
  const issuesJson = execSilent(`gh api "repos/${REPO}/issues?milestone=${SPRINT_MILESTONE}&state=open&per_page=100" --jq '[.[] | {number, title, assignee: .assignee.login}]'`);
  const allIssues = JSON.parse(issuesJson || '[]');
  
  // Filter issues that mention this member in body (since assignee might not be set via API)
  const memberIssues = allIssues.filter(issue => {
    const taskTitle = extractTaskTitle(issue.title);
    const filePath = ISSUE_TO_FILE_MAP[taskTitle];
    if (!filePath) return false;
    
    // Check if file matches member's assignments
    return isFileAssignedToMember(filePath, SPECIFIC_MEMBER);
  });

  console.log(`   Found ${memberIssues.length} issues assigned to ${SPECIFIC_MEMBER}\n`);

  if (memberIssues.length === 0) {
    log('yellow', '⚠️  No issues found for you. Check if issues exist and are assigned correctly.');
    process.exit(0);
  }

  // Step 2: Get local file changes
  log('blue', '📂 Step 2: Analyzing local file changes...');
  const gitStatus = execSilent('git status --porcelain');
  const changedFiles = new Set(
    gitStatus.split('\n')
      .filter(line => line.trim())
      .map(line => line.trim().split(/\s+/).slice(1).join(' '))
  );
  console.log(`   Found ${changedFiles.size} changed files\n`);

  // Step 3: Match issues to file changes
  log('blue', '📝 Step 3: Matching issues to file changes...\n');
  
  const tasks = [];
  
  for (const issue of memberIssues) {
    const taskTitle = extractTaskTitle(issue.title);
    const filePath = ISSUE_TO_FILE_MAP[taskTitle];
    
    if (!filePath) {
      console.log(`   ${colors.yellow}⚠️  No file mapping for: ${taskTitle}${colors.reset}`);
      continue;
    }

    // Check if file (or directory) has changes
    const hasChanges = [...changedFiles].some(f => f.startsWith(filePath.replace(/\/$/, '')) || f === filePath);
    
    if (!hasChanges) {
      console.log(`   ${colors.yellow}⏭️  No changes for: ${taskTitle}${colors.reset}`);
      continue;
    }

    const userStoryNum = TITLE_TO_USER_STORY[taskTitle] || 43;
    const titleSlug = taskTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const branchName = `user-story-${userStoryNum}/task-${issue.number}-${titleSlug}`;

    console.log(`   ${colors.green}✓ #${issue.number}: ${taskTitle}${colors.reset}`);
    console.log(`      File: ${filePath}`);
    console.log(`      Branch: ${branchName}`);

    tasks.push({
      issueNumber: issue.number,
      title: taskTitle,
      filePath,
      branchName,
      userStoryNum
    });
  }

  console.log('');

  if (tasks.length === 0) {
    log('yellow', '⚠️  No matching file changes found for your assigned issues.');
    log('yellow', '   Make sure you have uncommitted changes for your assigned files.');
    process.exit(0);
  }

  // Limit tasks
  if (tasks.length > MAX_TASKS_PER_RUN) {
    log('yellow', `⚠️  Limiting to ${MAX_TASKS_PER_RUN} tasks per run.`);
    tasks.length = MAX_TASKS_PER_RUN;
  }

  // Step 4: Confirm and execute
  log('blue', `🚀 Step 4: Ready to create ${tasks.length} branch(es) and PR(s)\n`);

  if (DRY_RUN) {
    log('yellow', 'DRY RUN - Would execute:');
    tasks.forEach((t, i) => {
      console.log(`\n${i + 1}. Issue #${t.issueNumber}: ${t.title}`);
      console.log(`   Branch: ${t.branchName}`);
      console.log(`   File: ${t.filePath}`);
    });
    log('green', '\n✅ Dry run complete. Run without --dry-run to execute.');
    return;
  }

  const confirm = await askQuestion(`${colors.yellow}Create ${tasks.length} branches and PRs? (y/N): ${colors.reset}`);
  if (confirm !== 'y' && confirm !== 'yes') {
    log('yellow', '❌ Aborted by user.');
    process.exit(0);
  }

  // Execute
  let successCount = 0;
  const createdPRs = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`Task ${i + 1}/${tasks.length}: #${task.issueNumber} - ${task.title}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    try {
      // Stash, checkout master, pull
      log('cyan', 'Preparing branch...');
      execSilent('git stash push -m "auto-stash-for-pr"');
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      execSilent(`git pull origin ${DEFAULT_BRANCH}`);

      // Create or checkout branch
      const branchExists = execSilent(`git branch --list "${task.branchName}"`);
      if (branchExists) {
        execSilent(`git checkout "${task.branchName}"`);
        execSilent(`git merge ${DEFAULT_BRANCH}`);
      } else {
        execSilent(`git checkout -b "${task.branchName}"`);
      }
      
      // Pop stash
      execSilent('git stash pop');
      log('green', `   ✓ On branch: ${task.branchName}`);

      // Stage files
      log('cyan', 'Staging files...');
      if (task.filePath.endsWith('/')) {
        execSilent(`git add "${task.filePath}"`);
      } else {
        execSilent(`git add "${task.filePath}"`);
      }
      log('green', `   ✓ Staged: ${task.filePath}`);

      // Commit
      log('cyan', 'Committing...');
      const commitMsg = `feat: ${task.title}\n\nCloses #${task.issueNumber}`;
      const memberInfo = MEMBER_INFO[SPECIFIC_MEMBER];
      const authorFlag = memberInfo ? `--author="${memberInfo.name} <${memberInfo.email}>"` : '';
      try {
        execSilent(`git commit ${authorFlag} -m "${commitMsg.replace(/"/g, '\\"')}"`);
        log('green', '   ✓ Committed');
      } catch {
        log('yellow', '   ⚠️  Nothing to commit (already committed?)');
      }

      // Push
      log('cyan', 'Pushing branch...');
      execSilent(`git push -u origin "${task.branchName}"`) || execSilent(`git push origin "${task.branchName}"`);
      log('green', '   ✓ Pushed to origin');

      // Create PR
      log('cyan', 'Creating Pull Request...');
      const prBody = `## Summary\n${task.title}\n\n## Related Issue\nCloses #${task.issueNumber}\n\n## Files Changed\n- \`${task.filePath}\``;
      
      const prCmd = `gh pr create --repo ${REPO} --title "[#${task.issueNumber}] ${task.title}" --body "${prBody.replace(/`/g, '\\`').replace(/"/g, '\\"')}" --base ${DEFAULT_BRANCH} --head "${task.branchName}"`;
      
      try {
        const prUrl = execSilent(prCmd);
        log('green', `   ✓ PR created: ${prUrl}`);
        createdPRs.push({ issue: task.issueNumber, pr: prUrl });
      } catch {
        log('yellow', '   ⚠️  PR may already exist');
      }

      // Return to default branch
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      successCount++;

      // Rate limit
      if (i < tasks.length - 1) {
        console.log(`\n${colors.blue}⏳ Waiting ${RATE_LIMIT_MS / 1000}s...${colors.reset}`);
        await sleep(RATE_LIMIT_MS);
      }

    } catch (error) {
      log('red', `❌ Error: ${error.message}`);
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      execSilent('git stash pop');
    }
  }

  // Summary
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                         📊 SUMMARY                             ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`\n   ✅ Successfully created: ${successCount}/${tasks.length} PRs`);
  
  if (createdPRs.length > 0) {
    console.log('\n   Created PRs:');
    createdPRs.forEach(p => console.log(`     - #${p.issue}: ${p.pr}`));
  }
  
  console.log('\n   Next steps:');
  console.log('   1. Review your PRs on GitHub');
  console.log('   2. Request reviews from teammates');
  console.log('   3. Merge after approval');
}

// Helper: Check if file is assigned to member
function isFileAssignedToMember(filePath, member) {
  const assignments = {
    'Ansester': [
      'front-end/src/utils/auth.js',
      'front-end/src/context/',
      'front-end/src/App.jsx',
      'front-end/src/index.jsx',
      'front-end/src/services/api.js',
      'front-end/src/hooks/',
      'front-end/webpack.config.cjs',
      'front-end/public/',
      'back-end/server.js',
      'back-end/app.js',
      'back-end/package.json',
      'scripts/',
      '.github/'
    ],
    'TalalNaveed': [
      'back-end/routes/auth.js',
      'back-end/routes/dashboard.js',
      'back-end/routes/users.js',
      'back-end/routes/notifications.js',
      'back-end/middleware/',
      'back-end/config/',
      'back-end/utils/',
      'back-end/models/'
    ],
    'Shaf5': [
      'front-end/src/pages/staff/StaffDashboard.jsx',
      'front-end/src/pages/staff/Inventory.jsx',
      'front-end/src/pages/staff/CheckIn.jsx',
      'front-end/src/pages/staff/CheckOut.jsx',
      'front-end/src/pages/staff/CheckoutSuccess.jsx',
      'front-end/src/pages/staff/EditItem.jsx',
      'front-end/src/pages/staff/AddItem.jsx',
      'front-end/src/pages/staff/Overdue.jsx',
      'front-end/src/pages/staff/Reservations.jsx',
      'front-end/src/pages/staff/StaffLoginPage.jsx',
      'back-end/routes/staff.js',
      'back-end/routes/items.js'
    ],
    'Ak1016-stack': [
      'front-end/src/pages/HomePage.jsx',
      'front-end/src/pages/MyBorrowalsPage.jsx',
      'front-end/src/pages/MyReservationsPage.jsx',
      'front-end/src/pages/ReserveDateTimePage.jsx',
      'front-end/src/pages/ReservationConfirmedPage.jsx',
      'front-end/src/pages/ItemDetailPage.jsx',
      'front-end/src/pages/NotificationsPage.jsx',
      'front-end/src/pages/WaitlistConfirmedPage.jsx',
      'back-end/routes/borrowals.js',
      'back-end/routes/reservations.js',
      'back-end/routes/waitlist.js',
      'front-end/src/components/'
    ],
    'saadiftikhar04': [
      'front-end/src/pages/FinesPage.jsx',
      'front-end/src/pages/PayFinePage.jsx',
      'front-end/src/pages/PaymentHistoryPage.jsx',
      'front-end/src/pages/PaymentSuccessPage.jsx',
      'front-end/src/pages/landingpage.jsx',
      'front-end/src/pages/ProfileAndSettingsPage.jsx',
      'front-end/src/pages/HelpAndPoliciesPage.jsx',
      'front-end/src/pages/FilterAndSearchPage.jsx',
      'front-end/src/pages/BrowserCataloguePage.jsx',
      'front-end/src/pages/FacilityItemsPage.jsx',
      'front-end/src/pages/StudentLoginPage.jsx',
      'front-end/src/pages/StudentRegisterPage.jsx',
      'front-end/src/pages/staff/ManageFines.jsx',
      'front-end/src/pages/staff/AutomatedAlerts.jsx',
      'back-end/routes/fines.js',
      'back-end/routes/payments.js',
      'back-end/routes/facilities.js',
      'back-end/routes/policies.js',
      'back-end/routes/help.js',
      'back-end/routes/alerts.js'
    ]
  };

  const patterns = assignments[member] || [];
  return patterns.some(pattern => {
    if (pattern.endsWith('/')) {
      return filePath.startsWith(pattern);
    }
    return filePath === pattern || filePath.startsWith(pattern);
  });
}

main().catch(console.error);
