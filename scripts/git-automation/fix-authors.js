#!/usr/bin/env node

/**
 * CAMP Project - Fix PR Commit Authors
 * 
 * This script fixes the commit authorship for open PRs where the commit
 * was made by Ansester but the PR belongs to another team member.
 * 
 * It will:
 * 1. Save the PR diff (patch)
 * 2. Close the existing PR and delete the branch
 * 3. Create a new branch from master
 * 4. Apply the saved patch
 * 5. Commit with YOUR correct author
 * 6. Create a new PR
 * 
 * Usage: node fix-authors.js --member <username> [--dry-run]
 * 
 * Each team member should run this script with their own username.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const REPO = 'agile-students-fall2025/4-final-camp';
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Member info for commit authorship
const MEMBER_INFO = {
  'TalalNaveed': { name: 'TalalNaveed', email: 'sk10741@nyu.edu' },
  'Shaf5': { name: 'Shaf5', email: 'si2356@nyu.edu' },
  'Ak1016-stack': { name: 'Ak1016-stack', email: 'ak10747@nyu.edu' },
  'saadiftikhar04': { name: 'saadiftikhar04', email: 'si2344@nyu.edu' }
};

const VALID_MEMBERS = Object.keys(MEMBER_INFO);

// Parse arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
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
  console.log(`${colors.cyan}║        CAMP Project - Fix PR Commit Authors                    ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');

  // Validate member
  if (!SPECIFIC_MEMBER) {
    log('red', '❌ ERROR: --member flag is required!');
    console.log('\nUsage: node fix-authors.js --member YOUR_GITHUB_USERNAME [--dry-run]');
    console.log('\nValid members (run with your own username):');
    VALID_MEMBERS.forEach(m => console.log(`  - ${m}`));
    process.exit(1);
  }

  if (!VALID_MEMBERS.includes(SPECIFIC_MEMBER)) {
    log('red', `❌ ERROR: "${SPECIFIC_MEMBER}" is not in the list.`);
    console.log('\nValid members:');
    VALID_MEMBERS.forEach(m => console.log(`  - ${m}`));
    process.exit(1);
  }

  const memberInfo = MEMBER_INFO[SPECIFIC_MEMBER];
  log('green', `✅ Fixing PRs for: ${SPECIFIC_MEMBER} <${memberInfo.email}>`);
  if (DRY_RUN) log('yellow', '🔍 DRY RUN MODE - No changes will be made');
  console.log('');

  // Verify GitHub CLI
  log('blue', '🔐 Verifying GitHub authentication...');
  const ghStatus = execSilent('gh auth status 2>&1');
  if (!ghStatus.includes('Logged in')) {
    log('red', '❌ ERROR: Not logged into GitHub CLI! Run: gh auth login');
    process.exit(1);
  }
  log('green', '   ✓ GitHub CLI authenticated\n');

  // Get open PRs where this member is the PR author
  log('blue', `📋 Fetching your open PRs...`);
  
  const prsJson = execSilent(`gh pr list --repo ${REPO} --state open --author ${SPECIFIC_MEMBER} --json number,title,headRefName,commits`);
  let prs = JSON.parse(prsJson || '[]');
  
  // Filter to only PRs where commit author is Ansester (needs fixing)
  const prsToFix = prs.filter(pr => {
    if (!pr.commits || pr.commits.length === 0) return false;
    const commitAuthor = pr.commits[0].authors?.[0]?.login;
    return commitAuthor === 'Ansester';
  });
  
  console.log(`   Found ${prs.length} open PRs, ${prsToFix.length} need commit author fix\n`);

  if (prsToFix.length === 0) {
    log('green', '✅ All your PRs already have correct commit authorship!');
    process.exit(0);
  }

  // Show PRs
  console.log('   PRs to fix (commit shows Ansester, should be you):');
  prsToFix.forEach(pr => {
    console.log(`   - #${pr.number}: ${pr.title}`);
  });
  console.log('');

  if (DRY_RUN) {
    log('yellow', 'DRY RUN - Would fix the above PRs with correct authorship.');
    log('green', '\n✅ Dry run complete. Run without --dry-run to execute.');
    return;
  }

  // Confirm
  const confirm = await askQuestion(`${colors.yellow}Fix ${prsToFix.length} PRs with correct authorship? (y/N): ${colors.reset}`);
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

  for (let i = 0; i < prsToFix.length; i++) {
    const pr = prsToFix[i];
    
    console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`[${i + 1}/${prsToFix.length}] PR #${pr.number}: ${pr.title}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    // Ensure temp directory exists for each iteration
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    try {
      // STEP 1: Save the PR diff as a patch file BEFORE closing
      log('cyan', '1. Saving PR diff as patch...');
      const patchFile = path.join(tempDir, `pr-${pr.number}.patch`);
      const patchContent = execWithOutput(`gh pr diff ${pr.number} --repo ${REPO}`);
      
      if (!patchContent || patchContent.trim().length === 0) {
        log('yellow', '⚠️  No diff found in PR, skipping');
        continue;
      }
      
      fs.writeFileSync(patchFile, patchContent);
      console.log(`   Saved patch to ${patchFile}`);

      // Get file list for PR body
      const filesOutput = execSilent(`gh pr diff ${pr.number} --repo ${REPO} --name-only`);
      const files = filesOutput.split('\n').filter(f => f.trim());
      console.log(`   Files: ${files.join(', ')}`);

      // Extract issue number from title
      const issueMatch = pr.title.match(/#(\d+)/);
      const issueNum = issueMatch ? issueMatch[1] : '';
      const taskTitle = pr.title.replace(/^\[#\d+\]\s*/, '');

      // STEP 2: Close the PR and delete remote branch
      log('cyan', '2. Closing old PR and deleting branch...');
      execSilent(`gh pr close ${pr.number} --repo ${REPO} --delete-branch`);
      
      // Delete local branch if exists
      execSilent(`git branch -D "${pr.headRefName}"`);

      // STEP 3: Ensure we're on updated master
      log('cyan', '3. Updating from master...');
      execSilent(`git checkout ${DEFAULT_BRANCH}`);
      execSilent(`git pull origin ${DEFAULT_BRANCH}`);

      // STEP 4: Create new branch
      log('cyan', `4. Creating branch: ${pr.headRefName}`);
      execSilent(`git checkout -b "${pr.headRefName}"`);

      // STEP 5: Apply the patch
      log('cyan', '5. Applying saved patch...');
      
      // Try to apply - if it fails due to already applied, try with 3way
      let applied = false;
      try {
        execSync(`git apply "${patchFile}"`, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
        applied = true;
      } catch (e) {
        // Try with 3way merge
        try {
          execSync(`git apply --3way "${patchFile}"`, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' });
          applied = true;
        } catch (e2) {
          log('yellow', `⚠️  Patch may already be applied or conflicts exist`);
        }
      }

      // STEP 6: Stage and commit
      log('cyan', '6. Staging and committing...');
      execSilent('git add -A');
      
      const status = execSilent('git status --porcelain');
      if (!status) {
        log('yellow', '⚠️  Nothing to commit (changes may already be in master), skipping');
        execSilent(`git checkout ${DEFAULT_BRANCH}`);
        execSilent(`git branch -D "${pr.headRefName}"`);
        continue;
      }

      // Commit with correct author
      const commitMsg = `feat: ${taskTitle}${issueNum ? `\n\nCloses #${issueNum}` : ''}`;
      execSilent(`git commit --author="${memberInfo.name} <${memberInfo.email}>" -m "${commitMsg.replace(/"/g, '\\"')}"`);
      log('green', `   ✓ Committed as ${memberInfo.name} <${memberInfo.email}>`);

      // STEP 7: Push branch
      log('cyan', '7. Pushing branch...');
      execSilent(`git push -u origin "${pr.headRefName}" --force`);

      // STEP 8: Create new PR
      log('cyan', '8. Creating new PR...');
      const prBody = `## Summary\n${taskTitle}\n\n## Related Issue\n${issueNum ? `Closes #${issueNum}` : 'N/A'}\n\n## Files Changed\n${files.map(f => `- \`${f}\``).join('\n')}`;
      
      const newPrUrl = execSilent(`gh pr create --repo ${REPO} --title "${pr.title.replace(/"/g, '\\"')}" --body "${prBody.replace(/"/g, '\\"').replace(/`/g, '\\`')}" --base ${DEFAULT_BRANCH} --head "${pr.headRefName}"`);
      
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
      if (i < prsToFix.length - 1) {
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
  console.log(`   Fixed: ${successCount}/${prsToFix.length} PRs`);
  
  if (newPRs.length > 0) {
    console.log('\n   New PRs:');
    newPRs.forEach(p => console.log(`     - ${p.title}: ${p.new}`));
  }

  console.log('\n   ✅ Done! Commits now show correct authorship.');
}

main().catch(console.error);
