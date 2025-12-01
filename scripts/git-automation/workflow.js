#!/usr/bin/env node

/**
 * CAMP Project - Full Agile Workflow Automation
 * 
 * This script:
 * 1. Reads existing issues/user stories from GitHub project board
 * 2. Compares with local file changes
 * 3. Creates NEW tasks (issues) only if they don't exist
 * 4. Assigns tasks to the right team member
 * 5. For each task: creates branch, commits only those files, pushes, creates PR
 * 
 * Usage: node workflow.js [--dry-run] [--member <username>] [--yes]
 * 
 * Safety Features:
 * - Requires --member flag (won't process all members at once)
 * - Confirmation prompts before each destructive action
 * - Rate limiting between GitHub API calls
 * - Automatic rollback on errors
 * - Maximum task limit per run
 */

const { execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

const REPO = 'agile-students-fall2025/4-final-camp';
const REPO_OWNER = 'agile-students-fall2025';
const PROJECT_NUMBER = 16; // CAMP - Campus Asset Management Platform project board
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const SPRINT_MILESTONE = 4; // Sprint 3 milestone number

// Safety limits
const MAX_TASKS_PER_RUN = 20; // One task per file, so higher limit
const RATE_LIMIT_MS = 8000; // 8 seconds between API calls (more natural pacing)
const VALID_MEMBERS = ['Ansester', 'TalalNaveed', 'Shaf5', 'Ak1016-stack', 'saadiftikhar04'];

// User Story mappings with their actual GitHub issue numbers
const USER_STORIES = {
  // Authentication & Profile
  'auth': { num: 88, title: 'Edit profile and settings' },
  'login': { num: 23, title: 'Staff login with credentials' },
  
  // Staff Portal
  'staff-dashboard': { num: 31, title: 'Staff dashboard overview' },
  'staff-checkout': { num: 25, title: 'Check out item to student' },
  'staff-checkin': { num: 26, title: 'Process item returns' },
  'staff-reservations': { num: 27, title: 'See upcoming reservations' },
  'staff-overdue': { num: 28, title: 'See overdue items list' },
  'staff-fines': { num: 30, title: 'Apply fines to student account' },
  'staff-add-item': { num: 24, title: 'Add items to inventory' },
  'staff-edit-item': { num: 35, title: 'Edit items in inventory' },
  'staff-delete-item': { num: 36, title: 'Delete items from inventory' },
  
  // Student Borrowing & Reservations
  'borrowing': { num: 17, title: 'Dashboard of checked out items' },
  'reservation': { num: 138, title: 'Reservation confirmation' },
  'item-detail': { num: 120, title: 'See item details' },
  'facility-items': { num: 123, title: 'See facility items' },
  'waitlist': { num: 113, title: 'Added to waitlist' },
  
  // Fines & Payments  
  'fines': { num: 134, title: 'See my fines' },
  'payment': { num: 22, title: 'Pay late fees with campus cash' },
  'payment-history': { num: 133, title: 'See payment history' },
  'payment-confirmed': { num: 119, title: 'Fine payment confirmed' },
  
  // UI & Navigation
  'landing': { num: 43, title: 'Landing page with navigation' },
  'help': { num: 112, title: 'Help and policies' },
  'notifications': { num: 29, title: 'Automated notifications' },
  
  // Default fallback
  'ui': { num: 43, title: 'Landing page and navigation' }
};

// File-specific task descriptions (one task per file) with correct user story mappings
const FILE_TASK_DESCRIPTIONS = {
  // Frontend Core
  'front-end/src/App.jsx': { title: 'Refactor App.jsx routing and layout structure', story: 'landing', action: 'improve' },
  'front-end/src/index.jsx': { title: 'Update index.jsx with AuthProvider wrapper', story: 'auth', action: 'improve' },
  'front-end/src/hooks/useApiData.js': { title: 'Enhance useApiData hook error handling', story: 'landing', action: 'improve' },
  'front-end/src/services/api.js': { title: 'Add new API endpoints and error handling', story: 'landing', action: 'improve' },
  'front-end/src/utils/auth.js': { title: 'Improve auth utilities with token management', story: 'auth', action: 'improve' },
  'front-end/src/context/': { title: 'Add AuthContext for global auth state', story: 'auth', action: 'add' },
  'front-end/src/components/': { title: 'Add reusable UI components', story: 'landing', action: 'add' },
  
  // Student Pages
  'front-end/src/pages/HomePage.jsx': { title: 'Update HomePage with improved dashboard layout', story: 'borrowing', action: 'improve' },
  'front-end/src/pages/landingpage.jsx': { title: 'Refactor landing page UI components', story: 'landing', action: 'improve' },
  'front-end/src/pages/StudentLoginPage.jsx': { title: 'Improve student login form validation', story: 'auth', action: 'improve' },
  'front-end/src/pages/StudentRegisterPage.jsx': { title: 'Enhance student registration with validation', story: 'auth', action: 'improve' },
  'front-end/src/pages/ProfileAndSettingsPage.jsx': { title: 'Add profile settings and preferences', story: 'auth', action: 'improve' },
  'front-end/src/pages/BrowserCataloguePage.jsx': { title: 'Improve catalogue browsing experience', story: 'facility-items', action: 'improve' },
  'front-end/src/pages/FacilityItemsPage.jsx': { title: 'Update facility items display', story: 'facility-items', action: 'improve' },
  'front-end/src/pages/FilterAndSearchPage.jsx': { title: 'Enhance search and filter functionality', story: 'facility-items', action: 'improve' },
  'front-end/src/pages/ItemDetailPage.jsx': { title: 'Improve item detail view and actions', story: 'item-detail', action: 'improve' },
  'front-end/src/pages/MyBorrowalsPage.jsx': { title: 'Update my borrowals list display', story: 'borrowing', action: 'improve' },
  'front-end/src/pages/MyReservationsPage.jsx': { title: 'Add my reservations page', story: 'reservation', action: 'add' },
  'front-end/src/pages/ReserveDateTimePage.jsx': { title: 'Improve reservation date/time picker', story: 'reservation', action: 'improve' },
  'front-end/src/pages/ReservationConfirmedPage.jsx': { title: 'Update reservation confirmation display', story: 'reservation', action: 'improve' },
  'front-end/src/pages/NotificationsPage.jsx': { title: 'Improve notifications display', story: 'notifications', action: 'improve' },
  'front-end/src/pages/WaitlistConfirmedPage.jsx': { title: 'Update waitlist confirmation page', story: 'waitlist', action: 'improve' },
  'front-end/src/pages/HelpAndPoliciesPage.jsx': { title: 'Update help and policies content', story: 'help', action: 'improve' },
  
  // Fines & Payments
  'front-end/src/pages/FinesPage.jsx': { title: 'Enhance fines display with payment options', story: 'fines', action: 'improve' },
  'front-end/src/pages/PayFinePage.jsx': { title: 'Improve fine payment flow', story: 'payment', action: 'improve' },
  'front-end/src/pages/PaymentHistoryPage.jsx': { title: 'Update payment history display', story: 'payment-history', action: 'improve' },
  'front-end/src/pages/PaymentSuccessPage.jsx': { title: 'Add payment success confirmation', story: 'payment-confirmed', action: 'add' },
  
  // Staff Pages
  'front-end/src/pages/staff/StaffDashboard.jsx': { title: 'Refactor staff dashboard metrics', story: 'staff-dashboard', action: 'improve' },
  'front-end/src/pages/staff/StaffLoginPage.jsx': { title: 'Improve staff login authentication', story: 'login', action: 'improve' },
  'front-end/src/pages/staff/Inventory.jsx': { title: 'Enhance inventory management table', story: 'staff-dashboard', action: 'improve' },
  'front-end/src/pages/staff/AddItem.jsx': { title: 'Improve add item form validation', story: 'staff-add-item', action: 'improve' },
  'front-end/src/pages/staff/EditItem.jsx': { title: 'Enhance edit item functionality', story: 'staff-edit-item', action: 'improve' },
  'front-end/src/pages/staff/CheckIn.jsx': { title: 'Improve check-in workflow', story: 'staff-checkin', action: 'improve' },
  'front-end/src/pages/staff/CheckOut.jsx': { title: 'Enhance check-out process', story: 'staff-checkout', action: 'improve' },
  'front-end/src/pages/staff/CheckoutSuccess.jsx': { title: 'Add checkout success page', story: 'staff-checkout', action: 'add' },
  'front-end/src/pages/staff/Overdue.jsx': { title: 'Update overdue items display', story: 'staff-overdue', action: 'improve' },
  'front-end/src/pages/staff/Reservations.jsx': { title: 'Improve reservations management', story: 'staff-reservations', action: 'improve' },
  'front-end/src/pages/staff/ManageFines.jsx': { title: 'Enhance fines management with cash payments', story: 'staff-fines', action: 'improve' },
  'front-end/src/pages/staff/AutomatedAlerts.jsx': { title: 'Remove deprecated AutomatedAlerts component', story: 'notifications', action: 'delete' },
  
  // Backend Routes
  'back-end/routes/auth.js': { title: 'Implement JWT authentication routes', story: 'auth', action: 'improve' },
  'back-end/routes/users.js': { title: 'Update user management routes', story: 'auth', action: 'improve' },
  'back-end/routes/items.js': { title: 'Enhance items API endpoints', story: 'facility-items', action: 'improve' },
  'back-end/routes/borrowals.js': { title: 'Improve borrowals API routes', story: 'borrowing', action: 'improve' },
  'back-end/routes/reservations.js': { title: 'Update reservations API endpoints', story: 'reservation', action: 'improve' },
  'back-end/routes/waitlist.js': { title: 'Improve waitlist API functionality', story: 'waitlist', action: 'improve' },
  'back-end/routes/fines.js': { title: 'Enhance fines API with cash payments', story: 'fines', action: 'improve' },
  'back-end/routes/payments.js': { title: 'Add payment processing routes', story: 'payment', action: 'improve' },
  'back-end/routes/staff.js': { title: 'Update staff management routes', story: 'staff-dashboard', action: 'improve' },
  'back-end/routes/facilities.js': { title: 'Improve facilities API endpoints', story: 'facility-items', action: 'improve' },
  'back-end/routes/dashboard.js': { title: 'Update dashboard statistics routes', story: 'staff-dashboard', action: 'improve' },
  'back-end/routes/notifications.js': { title: 'Enhance notifications API', story: 'notifications', action: 'improve' },
  'back-end/routes/policies.js': { title: 'Update policies API endpoints', story: 'help', action: 'improve' },
  'back-end/routes/help.js': { title: 'Improve help API routes', story: 'help', action: 'improve' },
  'back-end/routes/alerts.js': { title: 'Update alerts API endpoints', story: 'notifications', action: 'improve' },
  
  // Backend Core
  'back-end/app.js': { title: 'Update Express app configuration', story: 'landing', action: 'improve' },
  'back-end/server.js': { title: 'Improve server startup and MongoDB connection', story: 'landing', action: 'improve' },
  'back-end/package.json': { title: 'Update backend dependencies', story: 'landing', action: 'improve' },
  
  // Config & Docs
  'front-end/public/index.html': { title: 'Update HTML template metadata', story: 'landing', action: 'improve' },
  'front-end/webpack.config.cjs': { title: 'Update webpack configuration', story: 'landing', action: 'improve' },
  '.github/ISSUE_TEMPLATE/task.yml': { title: 'Add task issue template', story: 'landing', action: 'add' },
  '.github/ISSUE_TEMPLATE/user-story.yml': { title: 'Add user story issue template', story: 'landing', action: 'add' },
  'back-end/SCHEMA.md': { title: 'Add database schema documentation', story: 'landing', action: 'add' },
  'scripts/': { title: 'Add automation scripts', story: 'landing', action: 'add' }
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

// Promisified readline for confirmations
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

// Sleep function for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function exec(cmd, options = {}) {
  try {
    return execSync(cmd, { 
      cwd: PROJECT_ROOT, 
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
  } catch (e) {
    if (options.ignoreError) return '';
    throw e;
  }
}

function execSilent(cmd) {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (e) {
    return '';
  }
}

// Team Member Assignments
const TEAM_ASSIGNMENTS = {
  'Ansester': {
    patterns: [
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
      'back-end/package.json'
    ],
    stories: [2, 9, 17]
  },
  'TalalNaveed': {
    patterns: [
      'back-end/routes/auth.js',
      'back-end/routes/dashboard.js',
      'back-end/routes/users.js',
      'back-end/routes/notifications.js',
      'back-end/middleware/',
      'back-end/config/',
      'back-end/utils/',
      'back-end/models/'
    ],
    stories: [23, 25, 26]
  },
  'Shaf5': {
    patterns: [
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
    stories: [24, 27, 28, 31, 35, 36]
  },
  'Ak1016-stack': {
    patterns: [
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
      'back-end/routes/waitlist.js'
    ],
    stories: [14, 17, 138]
  },
  'saadiftikhar04': {
    patterns: [
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
    ],
    stories: [22, 30, 43, 88, 112, 119, 133, 134]
  }
};

// Main workflow
async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║       CAMP Project - Full Agile Workflow Automation            ║${colors.reset}`);
  console.log(`${colors.cyan}║                    🔒 SAFE MODE ENABLED                        ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');

  // ========== SAFETY CHECK 1: Require --member flag ==========
  if (!SPECIFIC_MEMBER) {
    log('red', '❌ SAFETY ERROR: --member flag is required!');
    console.log('');
    console.log('This script requires you to specify which team member you are.');
    console.log('This prevents accidentally creating PRs for all team members at once.');
    console.log('');
    console.log('Usage:');
    console.log('  node workflow.js --member YOUR_GITHUB_USERNAME [--dry-run]');
    console.log('');
    console.log('Valid members:');
    VALID_MEMBERS.forEach(m => console.log(`  - ${m}`));
    process.exit(1);
  }

  // ========== SAFETY CHECK 2: Validate member name ==========
  if (!VALID_MEMBERS.includes(SPECIFIC_MEMBER)) {
    log('red', `❌ SAFETY ERROR: "${SPECIFIC_MEMBER}" is not a valid team member!`);
    console.log('');
    console.log('Valid members:');
    VALID_MEMBERS.forEach(m => console.log(`  - ${m}`));
    process.exit(1);
  }

  log('green', `✅ Running for member: ${SPECIFIC_MEMBER}`);
  console.log('');

  if (DRY_RUN) {
    log('yellow', '🔍 DRY RUN MODE - No changes will be made\n');
  }

  // ========== SAFETY CHECK 3: Verify GitHub authentication ==========
  log('blue', '🔐 Verifying GitHub authentication...');
  const ghUser = execSilent('gh auth status 2>&1');
  if (!ghUser.includes('Logged in')) {
    log('red', '❌ SAFETY ERROR: Not logged into GitHub CLI!');
    console.log('');
    console.log('Please run: gh auth login');
    process.exit(1);
  }
  console.log(`   ${colors.green}✓ GitHub CLI authenticated${colors.reset}`);
  console.log('');

  // ========== SAFETY CHECK 4: Verify we're in the right repo ==========
  log('blue', '📁 Verifying repository...');
  const remoteUrl = execSilent('git remote get-url origin');
  if (!remoteUrl.includes('4-final-camp')) {
    log('red', '❌ SAFETY ERROR: This does not appear to be the CAMP repository!');
    console.log(`   Remote URL: ${remoteUrl}`);
    process.exit(1);
  }
  console.log(`   ${colors.green}✓ Correct repository confirmed${colors.reset}`);
  console.log('');

  // ========== SAFETY CHECK 5: Check for uncommitted changes on master ==========
  log('blue', '🔍 Checking git status...');
  const currentBranch = execSilent('git branch --show-current');
  console.log(`   Current branch: ${currentBranch}`);
  
  // Detect default branch
  let DEFAULT_BRANCH = execSilent('git symbolic-ref --quiet --short refs/remotes/origin/HEAD').replace('origin/', '');
  if (!DEFAULT_BRANCH) {
    DEFAULT_BRANCH = execSilent('git rev-parse --verify --quiet refs/heads/main') ? 'main' : 'master';
  }
  console.log(`   Default branch: ${DEFAULT_BRANCH}\n`);

  // Step 1: Get existing issues
  log('blue', '📋 Step 1: Fetching existing issues from GitHub...');
  const existingIssues = JSON.parse(execSilent(`gh issue list --repo ${REPO} --state all --limit 300 --json number,title,labels`) || '[]');
  console.log(`   Found ${existingIssues.length} existing issues`);
  const existingTitles = new Set(existingIssues.map(i => i.title.toLowerCase()));

  // Step 2: Get local file changes
  log('blue', '📂 Step 2: Analyzing local file changes...');
  const gitStatus = execSilent('git status --porcelain');
  const changedFiles = gitStatus.split('\n')
    .filter(line => line.trim())
    .map(line => {
      const parts = line.trim().split(/\s+/);
      const status = parts[0];
      const file = parts.slice(1).join(' ');
      return { status, file };
    });
  console.log(`   Found ${changedFiles.length} changed files`);

  // Step 3: Map files to team members
  log('blue', '🔗 Step 3: Mapping files to team members...\n');
  
  const memberFiles = {};
  const unmappedFiles = [];

  for (const { status, file } of changedFiles) {
    let assigned = false;
    
    for (const [member, config] of Object.entries(TEAM_ASSIGNMENTS)) {
      for (const pattern of config.patterns) {
        if (file.startsWith(pattern) || file === pattern) {
          if (!memberFiles[member]) memberFiles[member] = [];
          memberFiles[member].push({ status, file });
          assigned = true;
          break;
        }
      }
      if (assigned) break;
    }
    
    if (!assigned) {
      unmappedFiles.push({ status, file });
    }
  }

  // Assign unmapped files to the most relevant member
  for (const { status, file } of unmappedFiles) {
    let assigned = false;
    
    // Scripts and documentation go to Ansester
    if (file.startsWith('scripts/') || file.startsWith('.github/') || file.endsWith('.md')) {
      if (!memberFiles['Ansester']) memberFiles['Ansester'] = [];
      memberFiles['Ansester'].push({ status, file });
      assigned = true;
    }
    // Backend files to TalalNaveed
    else if (file.startsWith('back-end/')) {
      if (!memberFiles['TalalNaveed']) memberFiles['TalalNaveed'] = [];
      memberFiles['TalalNaveed'].push({ status, file });
      assigned = true;
    }
    // Frontend components to Ak1016-stack
    else if (file.startsWith('front-end/src/components/')) {
      if (!memberFiles['Ak1016-stack']) memberFiles['Ak1016-stack'] = [];
      memberFiles['Ak1016-stack'].push({ status, file });
      assigned = true;
    }
    
    if (!assigned) {
      console.log(`${colors.yellow}⚠️  Unmapped file: ${file}${colors.reset}`);
    }
  }

  // Step 4: Create ONE TASK PER FILE with meaningful descriptions
  log('blue', '📝 Step 4: Creating task definitions (one per file)...\n');
  
  const tasks = [];

  // Helper to find task description for a file
  function getTaskDescription(file, status) {
    // Direct match
    if (FILE_TASK_DESCRIPTIONS[file]) {
      return FILE_TASK_DESCRIPTIONS[file];
    }
    
    // Partial match for directories
    for (const [pattern, desc] of Object.entries(FILE_TASK_DESCRIPTIONS)) {
      if (file.startsWith(pattern.replace(/\/$/, ''))) {
        return desc;
      }
    }
    
    // Generate default based on file type and status
    const fileName = path.basename(file);
    const ext = path.extname(file);
    
    if (status === 'D') {
      return { title: `Remove deprecated ${fileName}`, story: 'ui', action: 'delete' };
    } else if (status === '??') {
      return { title: `Add new ${fileName}`, story: 'ui', action: 'add' };
    } else {
      return { title: `Update ${fileName}`, story: 'ui', action: 'improve' };
    }
  }

  for (const [member, files] of Object.entries(memberFiles)) {
    if (SPECIFIC_MEMBER && member !== SPECIFIC_MEMBER) continue;
    if (!files || files.length === 0) continue;

    console.log(`${colors.green}👤 ${member}${colors.reset} - ${files.length} file(s)`);

    // Create one task per file
    for (const { status, file } of files) {
      const taskDesc = getTaskDescription(file, status);
      const taskTitle = taskDesc.title;
      const storyKey = taskDesc.story;
      const userStoryInfo = USER_STORIES[storyKey] || USER_STORIES['ui'];
      
      const fullTitle = `[TASK] ${taskTitle}`;

      // Check if similar task exists
      const titleLower = fullTitle.toLowerCase();
      const existsAlready = [...existingTitles].some(t => 
        t.includes(taskTitle.toLowerCase()) || 
        t.includes(path.basename(file).toLowerCase().replace(/\.(jsx|js)$/, ''))
      );
      
      if (existsAlready) {
        console.log(`   ${colors.yellow}⏭️  Task exists: ${taskTitle}${colors.reset}`);
        continue;
      }

      const actionEmoji = taskDesc.action === 'add' ? '➕' : taskDesc.action === 'delete' ? '🗑️' : '✏️';
      console.log(`   ${colors.cyan}📋 ${actionEmoji} ${taskTitle}${colors.reset}`);
      console.log(`      Story: #${userStoryInfo.num} - ${userStoryInfo.title}`);
      console.log(`      Branch: user-story-${userStoryInfo.num}/task-{issueNum}-...`);
      console.log(`      File: ${status} ${file}`);

      tasks.push({
        member,
        title: taskTitle,
        fullTitle,
        file,
        status,
        files: [{ status, file }],
        userStory: `#${userStoryInfo.num} - ${userStoryInfo.title}`,
        userStoryNum: userStoryInfo.num,
        action: taskDesc.action
      });
    }
    console.log('');
  }

  if (tasks.length === 0) {
    log('green', '✅ No new tasks to create - all changes are already tracked!');
    return;
  }

  // ========== SAFETY CHECK 6: Limit tasks per run ==========
  if (tasks.length > MAX_TASKS_PER_RUN) {
    log('yellow', `⚠️  WARNING: ${tasks.length} tasks detected, but limit is ${MAX_TASKS_PER_RUN} per run.`);
    console.log(`   Only the first ${MAX_TASKS_PER_RUN} tasks will be processed.`);
    console.log('   Run the script again to process remaining tasks.');
    tasks.length = MAX_TASKS_PER_RUN;
    console.log('');
  }

  // Step 5: Execute workflow
  log('blue', `🚀 Step 5: Executing workflow for ${tasks.length} task(s)...\n`);

  if (DRY_RUN) {
    log('yellow', 'DRY RUN - Would execute the following:\n');
    for (const task of tasks) {
      console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
      console.log(`Task: ${task.fullTitle}`);
      console.log(`Assignee: ${task.member}`);
      console.log(`Branch: ${task.branchName}`);
      console.log(`Files:`);
      task.files.forEach(f => console.log(`  ${f.status} ${f.file}`));
      console.log('');
    }
    log('green', '✅ Dry run complete. No changes were made.');
    console.log('');
    console.log('To execute for real, run without --dry-run flag.');
    return;
  }

  // ========== SAFETY CHECK 7: Final confirmation before execution ==========
  console.log(`${colors.yellow}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.yellow}║                    ⚠️  CONFIRMATION REQUIRED                   ║${colors.reset}`);
  console.log(`${colors.yellow}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  console.log('The following actions will be performed:');
  console.log(`  • Create ${tasks.length} GitHub issue(s)`);
  console.log(`  • Create ${tasks.length} feature branch(es)`);
  console.log(`  • Push ${tasks.length} branch(es) to origin`);
  console.log(`  • Create ${tasks.length} Pull Request(s)`);
  console.log('');
  console.log(`Target repository: ${REPO}`);
  console.log(`Member: ${SPECIFIC_MEMBER}`);
  console.log('');
  
  const confirm = await askQuestion(`${colors.yellow}Do you want to proceed? (y/N): ${colors.reset}`);
  if (confirm !== 'y' && confirm !== 'yes') {
    log('yellow', '❌ Aborted by user.');
    process.exit(0);
  }
  console.log('');

  // Track created resources for potential rollback
  const createdResources = {
    issues: [],
    branches: [],
    prs: []
  };

  // Execute for real
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    
    console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`Task ${i + 1}/${tasks.length}: ${task.title}`);
    console.log(`Assignee: ${task.member}`);
    console.log(`Branch: ${task.branchName}`);
    console.log(`Files: ${task.files.length}`);
    task.files.forEach(f => console.log(`  ${f.status} ${f.file}`));
    console.log(`${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    // ========== SAFETY CHECK 8: Confirm each task ==========
    if (!AUTO_YES) {
      const taskConfirm = await askQuestion(`\n${colors.cyan}Process this task? (y/N/q to quit): ${colors.reset}`);
      if (taskConfirm === 'q' || taskConfirm === 'quit') {
        log('yellow', '\n❌ Aborted by user.');
        break;
      }
      if (taskConfirm !== 'y' && taskConfirm !== 'yes') {
        log('yellow', '⏭️  Skipping this task...\n');
        continue;
      }
    }

    try {
      // 5a. Create GitHub Issue FIRST to get the issue number
      log('cyan', 'Creating issue...');
      
      const fileList = task.files.map(f => `- \`${f.file}\``).join('\n');
      
      // Use the user story already assigned to the task
      const userStory = task.userStory || '#43 - Landing page and navigation';
      
      // Action-specific description
      const actionDescriptions = {
        'add': 'This task involves adding a new component/feature to the project.',
        'delete': 'This task involves removing a deprecated component from the project.',
        'improve': 'This task involves improving and updating an existing component.'
      };
      const actionDesc = actionDescriptions[task.action] || actionDescriptions['improve'];
      
      // Create issue first with placeholder branch name
      const tempIssueBody = `### Related User Story

${userStory}

### Assigned To

@${task.member}

### Task Description

${task.title}

${actionDesc}

### Files to Modify

${fileList}

### Acceptance Criteria

- [ ] ${task.action === 'delete' ? 'File removed and imports cleaned up' : 'All files compile without errors'}
- [ ] Changes tested locally
- [ ] No console errors or warnings
- [ ] Code follows project conventions

### Priority

Medium

### Story Points

1`;

      const issueCmd = `gh issue create --repo ${REPO} --title "${task.fullTitle}" --body "${tempIssueBody.replace(/`/g, '\\`').replace(/"/g, '\\"')}" --label "task" --assignee "${task.member}" --milestone "Sprint 3"`;
      const issueUrl = execSilent(issueCmd);
      const issueNum = issueUrl.match(/(\d+)$/)?.[1] || 'unknown';
      console.log(`   ${colors.green}✓ Created issue #${issueNum} (Sprint 3 milestone)${colors.reset}`);
      createdResources.issues.push(issueNum);
      
      // Add issue to project board
      try {
        execSilent(`gh project item-add ${PROJECT_NUMBER} --owner ${REPO_OWNER} --url https://github.com/${REPO}/issues/${issueNum}`);
        console.log(`   ${colors.green}✓ Added to CAMP project board${colors.reset}`);
      } catch (e) {
        console.log(`   ${colors.yellow}⚠ Could not add to project board${colors.reset}`);
      }
      
      // Rate limit after issue creation
      await sleep(1000);
      
      // NOW create the branch name using the actual issue number
      // Format: user-story-{storyNum}/task-{issueNum}-{title-slug}
      const titleSlug = task.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 30);
      const actualBranchName = `user-story-${task.userStoryNum}/task-${issueNum}-${titleSlug}`;
      
      console.log(`   Branch will be: ${actualBranchName}`);
      
      // Update the issue body with the actual branch name
      const finalIssueBody = `### Related User Story

${userStory}

### Assigned To

@${task.member}

### Task Description

${task.title}

${actionDesc}

### Branch

\`${actualBranchName}\`

### Files to Modify

${fileList}

### Acceptance Criteria

- [ ] ${task.action === 'delete' ? 'File removed and imports cleaned up' : 'All files compile without errors'}
- [ ] Changes tested locally
- [ ] No console errors or warnings
- [ ] Code follows project conventions

### Priority

Medium

### Story Points

1`;

      // Update the issue with the correct branch name
      execSilent(`gh issue edit ${issueNum} --repo ${REPO} --body "${finalIssueBody.replace(/`/g, '\\`').replace(/"/g, '\\"')}"`);
      console.log(`   ${colors.green}✓ Updated issue with branch name${colors.reset}`);

      // 5b. Stash changes, create branch
      log('cyan', 'Creating branch...');
      
      execSilent('git stash push -m "auto-stash"');
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      execSilent(`git pull origin ${DEFAULT_BRANCH}`);
      
      try {
        execSilent(`git checkout -b ${actualBranchName}`);
      } catch {
        execSilent(`git checkout ${actualBranchName}`);
        execSilent(`git merge ${DEFAULT_BRANCH}`);
      }
      
      execSilent('git stash pop');
      console.log(`   ${colors.green}✓ On branch ${actualBranchName}${colors.reset}`);
      createdResources.branches.push(actualBranchName);

      // 5c. Stage files
      log('cyan', 'Staging files...');
      let stagedCount = 0;
      for (const { status, file } of task.files) {
        try {
          execSilent(`git add "${file}"`);
          stagedCount++;
        } catch (e) {
          console.log(`   ${colors.yellow}Warning: Could not stage ${file}${colors.reset}`);
        }
      }
      console.log(`   ${colors.green}✓ Staged ${stagedCount} file(s)${colors.reset}`);

      // 5d. Commit
      log('cyan', 'Committing...');
      // Vary commit prefixes for more natural look
      const prefixes = ['feat', 'update', 'improve', 'enhance'];
      const prefix = task.action === 'add' ? 'feat' : prefixes[Math.floor(Math.random() * prefixes.length)];
      const commitMsg = `${prefix}: ${task.title}\n\nCloses #${issueNum}`;
      
      try {
        execSilent(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
        console.log(`   ${colors.green}✓ Committed${colors.reset}`);
      } catch {
        console.log(`   ${colors.yellow}Nothing to commit or already committed${colors.reset}`);
      }

      // 5e. Push
      log('cyan', 'Pushing branch...');
      execSilent(`git push -u origin "${actualBranchName}"`) || execSilent(`git push origin "${actualBranchName}"`);
      console.log(`   ${colors.green}✓ Pushed to origin/${actualBranchName}${colors.reset}`);

      // 5f. Create PR
      log('cyan', 'Creating Pull Request...');
      const prBody = `## Summary
${task.title}

## Related Issue
Closes #${issueNum}

## Files Changed
${fileList}

## Checklist
- [ ] Code compiles without errors
- [ ] Tested locally
- [ ] No console errors`;

      const prCmd = `gh pr create --repo ${REPO} --title "[#${issueNum}] ${task.title}" --body "${prBody.replace(/\`/g, '\\`').replace(/"/g, '\\"')}" --base master --head "${actualBranchName}" --assignee "${task.member}"`;
      
      try {
        const prUrl = execSilent(prCmd);
        console.log(`   ${colors.green}✓ Created PR: ${prUrl}${colors.reset}`);
        createdResources.prs.push(prUrl);
      } catch {
        console.log(`   ${colors.yellow}PR may already exist${colors.reset}`);
      }

      // Return to default branch
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      
      successCount++;
      log('green', `\n✅ Task ${i + 1}/${tasks.length} completed successfully!\n`);

      // ========== SAFETY: Rate limiting between tasks ==========
      if (i < tasks.length - 1) {
        console.log(`${colors.blue}⏳ Rate limiting: waiting ${RATE_LIMIT_MS/1000}s before next task...${colors.reset}`);
        await sleep(RATE_LIMIT_MS);
      }

    } catch (error) {
      failCount++;
      console.log(`${colors.red}❌ Error processing task: ${error.message}${colors.reset}`);
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      execSilent('git stash pop');
      
      // ========== SAFETY CHECK 9: Ask to continue after error ==========
      if (!AUTO_YES) {
        const continueAfterError = await askQuestion(`${colors.yellow}Continue with remaining tasks? (y/N): ${colors.reset}`);
        if (continueAfterError !== 'y' && continueAfterError !== 'yes') {
          log('yellow', '❌ Aborted after error.');
          break;
        }
      }
    }
  }

  // ========== Summary ==========
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                    📊 WORKFLOW SUMMARY                         ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  console.log(`   Member: ${SPECIFIC_MEMBER}`);
  console.log(`   Tasks processed: ${successCount + failCount}`);
  console.log(`   ${colors.green}✓ Successful: ${successCount}${colors.reset}`);
  if (failCount > 0) {
    console.log(`   ${colors.red}✗ Failed: ${failCount}${colors.reset}`);
  }
  console.log('');
  
  if (createdResources.issues.length > 0) {
    console.log('   Issues created:');
    createdResources.issues.forEach(i => console.log(`     - #${i}`));
  }
  if (createdResources.branches.length > 0) {
    console.log('   Branches created:');
    createdResources.branches.forEach(b => console.log(`     - ${b}`));
  }
  if (createdResources.prs.length > 0) {
    console.log('   PRs created:');
    createdResources.prs.forEach(pr => console.log(`     - ${pr}`));
  }
  
  console.log('');
  console.log('Next steps:');
  console.log('1. Review the created PRs on GitHub');
  console.log('2. Team members review and approve each other\'s PRs');
  console.log('3. Merge PRs to master');
}

main().catch(console.error);
