#!/usr/bin/env node

/**
 * CAMP Project - Recover Closed PRs
 * 
 * This script recovers PRs that were closed by the previous broken script.
 * It fetches the diff from the closed PR and recreates it with correct authorship.
 * 
 * Usage: node recover-prs.js --member <username>
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const REPO = 'agile-students-fall2025/4-final-camp';
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Member info for commit authorship
const MEMBER_INFO = {
  'TalalNaveed': { name: 'TalalNaveed', email: 'mn3497@nyu.edu' },
  'Shaf5': { name: 'Shaf5', email: 'sk10741@nyu.edu' },
  'Ak1016-stack': { name: 'Ak1016-stack', email: 'ak10747@nyu.edu' },
  'saadiftikhar04': { name: 'saadiftikhar04', email: 'si2356@nyu.edu' }
};

// saadiftikhar04's closed PRs that need recovery
const CLOSED_PRS_TO_RECOVER = [
  { number: 506, title: '[#384] Enhance fines API with cash payments', branch: 'user-story-134/task-384-enhance-fines-api-with-cash-pa' },
  { number: 505, title: '[#386] Improve help API routes', branch: 'user-story-112/task-386-improve-help-api-routes' },
  { number: 504, title: '[#388] Add payment processing routes', branch: 'user-story-22/task-388-add-payment-processing-routes' },
  { number: 503, title: '[#390] Update policies API endpoints', branch: 'user-story-112/task-390-update-policies-api-endpoints' },
  { number: 502, title: '[#392] Improve catalogue browsing experience', branch: 'user-story-123/task-392-improve-catalogue-browsing-exp' },
  { number: 496, title: '[#404] Update payment history display', branch: 'user-story-133/task-404-update-payment-history-display' },
  { number: 495, title: '[#406] Add profile settings and preferences', branch: 'user-story-88/task-406-add-profile-settings-and-prefe' },
  { number: 494, title: '[#408] Improve student login form validation', branch: 'user-story-88/task-408-improve-student-login-form-val' },
  { number: 493, title: '[#410] Enhance student registration with validation', branch: 'user-story-88/task-410-enhance-student-registration-w' },
  { number: 492, title: '[#412] Refactor landing page UI components', branch: 'user-story-43/task-412-refactor-landing-page-ui-compo' },
  { number: 491, title: '[#414] Remove deprecated AutomatedAlerts component', branch: 'user-story-29/task-414-remove-deprecated-automatedale' },
  { number: 490, title: '[#416] Enhance fines management with cash payments', branch: 'user-story-30/task-416-enhance-fines-management-with-' }
];

const VALID_MEMBERS = Object.keys(MEMBER_INFO);

// Parse arguments
const args = process.argv.slice(2);
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

function execSilent(cmd) {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' }).trim();
  } catch (e) {
    return '';
  }
}

function execWithOutput(cmd) {
  try {
    return execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
  } catch (e) {
    return '';
  }
}

function askQuestion(question) {
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

async function main() {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║        CAMP Project - Recover Closed PRs                       ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');

  // Validate member
  if (!SPECIFIC_MEMBER) {
    log('red', '❌ ERROR: --member flag is required!');
    console.log('\nUsage: node recover-prs.js --member YOUR_GITHUB_USERNAME');
    console.log('\nValid members:');
    VALID_MEMBERS.forEach(m => console.log(`  - ${m}`));
    process.exit(1);
  }

  if (!VALID_MEMBERS.includes(SPECIFIC_MEMBER)) {
    log('red', `❌ ERROR: "${SPECIFIC_MEMBER}" is not in the list.`);
    process.exit(1);
  }

  const memberInfo = MEMBER_INFO[SPECIFIC_MEMBER];
  log('green', `✅ Recovering PRs for: ${SPECIFIC_MEMBER} <${memberInfo.email}>`);
  console.log('');

  // Verify GitHub CLI
  log('blue', '🔐 Verifying GitHub authentication...');
  const ghStatus = execSilent('gh auth status 2>&1');
  if (!ghStatus.includes('Logged in')) {
    log('red', '❌ ERROR: Not logged into GitHub CLI! Run: gh auth login');
    process.exit(1);
  }
  log('green', '   ✓ GitHub CLI authenticated\n');

  // Show PRs to recover
  console.log(`   PRs to recover (${CLOSED_PRS_TO_RECOVER.length}):`);
  CLOSED_PRS_TO_RECOVER.forEach(pr => {
    console.log(`   - #${pr.number}: ${pr.title}`);
  });
  console.log('');

  // Confirm
  const confirm = await askQuestion(`${colors.yellow}Recover ${CLOSED_PRS_TO_RECOVER.length} PRs? (y/N): ${colors.reset}`);
  if (confirm !== 'y' && confirm !== 'yes') {
    log('yellow', '❌ Aborted by user.');
    process.exit(0);
  }

  // Detect default branch
  let DEFAULT_BRANCH = execSilent('git symbolic-ref --quiet --short refs/remotes/origin/HEAD').replace('origin/', '');
  if (!DEFAULT_BRANCH) DEFAULT_BRANCH = 'master';

  // Ensure we're on master and up to date
  log('blue', 'Ensuring repository is up to date...');
  execSilent('git fetch origin');
  execSilent(`git checkout ${DEFAULT_BRANCH}`);
  execSilent(`git pull origin ${DEFAULT_BRANCH}`);

  let successCount = 0;
  const newPRs = [];
  const tempDir = path.join(PROJECT_ROOT, '.tmp-patches');
  
  // Create temp directory for patches
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  for (let i = 0; i < CLOSED_PRS_TO_RECOVER.length; i++) {
    const pr = CLOSED_PRS_TO_RECOVER[i];
    
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`[${i + 1}/${CLOSED_PRS_TO_RECOVER.length}] PR #${pr.number}: ${pr.title}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    // Ensure temp directory exists for each iteration
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    try {
      // STEP 1: Get the diff from the closed PR
      log('cyan', '1. Fetching diff from closed PR...');
      const patchFile = path.join(tempDir, `pr-${pr.number}.patch`);
      const patchContent = execWithOutput(`gh pr diff ${pr.number} --repo ${REPO}`);
      
      if (!patchContent || patchContent.trim().length === 0) {
        log('yellow', '⚠️  No diff found in closed PR, skipping');
        continue;
      }
      
      fs.writeFileSync(patchFile, patchContent);
      console.log(`   Saved patch`);

      // Get file list for PR body
      const filesOutput = execSilent(`gh pr diff ${pr.number} --repo ${REPO} --name-only`);
      const files = filesOutput.split('\n').filter(f => f.trim());
      console.log(`   Files: ${files.join(', ')}`);

      // Extract issue number from title
      const issueMatch = pr.title.match(/#(\d+)/);
      const issueNum = issueMatch ? issueMatch[1] : '';
      const taskTitle = pr.title.replace(/^\[#\d+\]\s*/, '');

      // STEP 2: Delete local branch if exists
      execSilent(`git branch -D "${pr.branch}"`);

      // STEP 3: Ensure we're on updated master
      log('cyan', '2. Updating from master...');
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      execSilent(`git pull origin ${DEFAULT_BRANCH}`);

      // STEP 4: Create new branch
      log('cyan', `3. Creating branch: ${pr.branch}`);
      execSilent(`git checkout -b "${pr.branch}"`);

      // STEP 5: Apply the patch
      log('cyan', '4. Applying patch...');
      
      let applied = false;
      try {
        execSync(`git apply "${patchFile}"`, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
        applied = true;
      } catch (e) {
        try {
          execSync(`git apply --3way "${patchFile}"`, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
          applied = true;
        } catch (e2) {
          log('yellow', `⚠️  Patch conflicts - attempting reject file approach`);
          try {
            execSync(`git apply --reject "${patchFile}"`, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
            applied = true;
          } catch (e3) {
            log('red', `   Cannot apply patch: ${e3.message}`);
          }
        }
      }

      // STEP 6: Stage and commit
      log('cyan', '5. Staging and committing...');
      execSilent('git add -A');
      
      const status = execSilent('git status --porcelain');
      if (!status) {
        log('yellow', '⚠️  Nothing to commit (changes may already be in master), skipping');
        execSilent(`git checkout ${DEFAULT_BRANCH}`);
        execSilent(`git branch -D "${pr.branch}"`);
        continue;
      }

      // Commit with correct author
      const commitMsg = `feat: ${taskTitle}${issueNum ? `\n\nCloses #${issueNum}` : ''}`;
      execSilent(`git commit --author="${memberInfo.name} <${memberInfo.email}>" -m "${commitMsg.replace(/"/g, '\\"')}"`);
      log('green', `   ✓ Committed as ${memberInfo.name} <${memberInfo.email}>`);

      // STEP 7: Push branch
      log('cyan', '6. Pushing branch...');
      execSilent(`git push -u origin "${pr.branch}" --force`);

      // STEP 8: Create new PR
      log('cyan', '7. Creating new PR...');
      const prBody = `## Summary\n${taskTitle}\n\n## Related Issue\n${issueNum ? `Closes #${issueNum}` : 'N/A'}\n\n## Files Changed\n${files.map(f => `- \`${f}\``).join('\n')}`;
      
      const newPrUrl = execSilent(`gh pr create --repo ${REPO} --title "${pr.title.replace(/"/g, '\\"')}" --body "${prBody.replace(/"/g, '\\"').replace(/`/g, '\\`')}" --base ${DEFAULT_BRANCH} --head "${pr.branch}"`);
      
      if (newPrUrl) {
        log('green', `   ✓ New PR created: ${newPrUrl}`);
        newPRs.push({ old: pr.number, new: newPrUrl, title: pr.title });
        successCount++;
      } else {
        log('red', '   ✗ Failed to create PR');
      }

      // Back to master
      execSilent(`git checkout ${DEFAULT_BRANCH}`);

      // Clean up patch file safely
      try {
        if (fs.existsSync(patchFile)) {
          fs.unlinkSync(patchFile);
        }
      } catch (e) {}

      // Rate limit
      if (i < CLOSED_PRS_TO_RECOVER.length - 1) {
        console.log(`\n${colors.blue}⏳ Waiting 3s before next PR...${colors.reset}`);
        await sleep(3000);
      }

    } catch (error) {
      log('red', `❌ Error: ${error.message}`);
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
    }
  }

  // Clean up temp directory
  try {
    fs.rmdirSync(tempDir);
  } catch (e) {}

  // Summary
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║                         📊 SUMMARY                             ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log(`\n   Member: ${SPECIFIC_MEMBER}`);
  console.log(`   Author: ${memberInfo.name} <${memberInfo.email}>`);
  console.log(`   Recovered: ${successCount}/${CLOSED_PRS_TO_RECOVER.length} PRs`);
  
  if (newPRs.length > 0) {
    console.log('\n   New PRs:');
    newPRs.forEach(p => console.log(`     - ${p.title}: ${p.new}`));
  }

  console.log('\n   ✅ Done!');
}

main().catch(console.error);
