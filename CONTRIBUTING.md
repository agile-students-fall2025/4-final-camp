# Contributing to CAMP

This document provides the rules and processes for contributing to the **CAMP (Campus Asset Management Platform)** project. Please review it before making contributions to ensure consistency and collaboration across the team.

---

## 📋 Table of Contents
1. [Team Norms](#team-norms)
2. [Git Workflow](#git-workflow)
3. [Development Environment Setup](#development-environment-setup)
4. [Coding Standards](#coding-standards)
5. [How to Contribute](#how-to-contribute)
6. [Pull Request Process](#pull-request-process)
7. [Building and Testing](#building-and-testing)

---

## 🧭 Team Norms

### Team Values
- **Respect:** Every voice matters; treat all feedback constructively.  
- **Communication:** Keep updates open and transparent.  
- **Collaboration:** Support teammates and review code with care.  
- **Accountability:** Own your assigned work and deliver on time.  
- **Quality:** Write maintainable, readable, and well-tested code.

### Work Expectations
- Commit regularly; don’t wait until the end of a sprint.  
- Review PRs within 24 hours.  
- Update task progress daily on the board.  
- Communicate blockers early.  
- Update documentation alongside new code.

---

## 🔁 Git Workflow

We follow the **Feature Branch Workflow**.

### Branch Naming
Use the format:  
`<type>/<short-description>`

Examples:
feature/add-login
fix/resolve-overdue-alert
docs/update-readme

perl
Copy code

### Commit Messages
Follow the format:
<type>: <description>

bash
Copy code
**Types:** feat, fix, docs, style, refactor, test, chore  
**Example:** `feat: implement staff overdue tracking`

### Workflow Steps
```bash
git checkout main
git pull origin main
git checkout -b feature/add-dashboard
# make changes
git add .
git commit -m "feat: add staff dashboard UI"
git push origin feature/add-dashboard
Then, open a Pull Request (PR) into the dev branch.

⚙️ Development Environment Setup
Prerequisites
Node.js v18+

MongoDB (local or Atlas)

Git

VS Code (recommended)

Setup Steps
bash
Copy code
git clone https://github.com/your-org/camp.git
cd camp
npm install
npm run dev
Create a .env file in the root directory:

ini
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/camp
JWT_SECRET=your_secret_key
Default URLs
Frontend → http://localhost:3000
Backend → http://localhost:5000

💻 Coding Standards
JavaScript & React
Use ES6 syntax (const, let, arrow functions).

Prefer functional components and React hooks.

Use camelCase for variables and PascalCase for components.

Keep files short and focused on one responsibility.

Include comments where clarity is needed.

Formatting & Linting
Use Prettier and ESLint:

bash
Copy code
npm run lint
npm run lint:fix
🧩 How to Contribute
Select or create an issue in the project board.

Move it to “In Progress.”

Create a branch using naming conventions.

Implement and test changes.

Commit and push code.

Submit a Pull Request to dev.

Request at least one team review.

🔍 Pull Request Process
Before submitting a PR:

 Code follows style guidelines

 All tests pass locally

 Documentation updated if needed

 No console logs or debugging code

After submitting:

Reviewer provides feedback within 24 hours.

Address feedback promptly.

Use “Squash and Merge” for final integration.

Delete branch after merging.

🧪 Building and Testing
Once test and build configurations are finalized, run:

bash
Copy code
npm run build
npm test
Future CI/CD pipelines will automate linting, builds, and testing.

👥 Team
Saad Iftikhar · Talal Naveed · Shaf Khalid · Akshith Karthik · Ashmit Mukherjee

💬 Questions?
Review this document first.

Check existing GitHub issues.

Reach out via team chat for clarification.

Contact the Scrum Master if unresolved.