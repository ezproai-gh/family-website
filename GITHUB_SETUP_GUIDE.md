# Step-by-Step: Push Code to GitHub

Complete guide to get your family website code on GitHub.

## Part 1: Create GitHub Account (If You Don't Have One)

### Step 1: Go to GitHub
1. Open browser: https://github.com
2. Click "Sign up" (top right)

### Step 2: Create Account
1. Enter email address
2. Create password
3. Choose username (e.g., `chrisjones`)
4. Click "Create account"
5. Verify email address
6. Complete sign-up

---

## Part 2: Install Git on Your Computer

### For Mac:
```bash
# Open Terminal
# Install Homebrew first (if you don't have it):
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Git:
brew install git

# Verify installation:
git --version
```

### For Windows:
1. Download: https://git-scm.com/download/win
2. Run the installer
3. Accept all defaults
4. Finish installation
5. Restart computer

### Verify Git Works:
Open Terminal/Command Prompt and run:
```bash
git --version
```

Should show: `git version 2.x.x`

---

## Part 3: Configure Git

Open Terminal/Command Prompt and run these commands:

```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

Replace:
- `Your Name` with your name (e.g., "Chris Jones")
- `your@email.com` with your GitHub email

**Verify it worked:**
```bash
git config --global user.name
git config --global user.email
```

Should show your name and email.

---

## Part 4: Create Repository on GitHub

### Step 1: Create New Repository
1. Log into GitHub: https://github.com
2. Click `+` icon (top right)
3. Select "New repository"

### Step 2: Fill in Details
- **Repository name:** `family-website`
- **Description:** `Family website with calendar, gallery, and events`
- **Public or Private:** Select **Public** (required for free Railway hosting)
- **Initialize repository:** Leave unchecked

### Step 3: Create Repository
Click "Create repository" button

You'll see a page with setup instructions. **Keep this page open.**

---

## Part 5: Push Code to GitHub

### Step 1: Open Terminal/Command Prompt

Navigate to your project folder:

```bash
cd /Users/chris/ClaudeCowork/Projects/ChrisJonesFamily
```

If you're not sure of the path, you can:
- **Mac:** Drag the folder into Terminal
- **Windows:** Copy the path from File Explorer address bar

### Step 2: Initialize Git Repository

Run this command in your project folder:

```bash
git init
```

You should see:
```
Initialized empty Git repository in /Users/chris/ClaudeCowork/Projects/ChrisJonesFamily/.git
```

### Step 3: Create .gitignore File

Create a file called `.gitignore` to exclude unnecessary files:

**Easy way (Terminal):**
```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.DS_Store
*.log
backend/.env
frontend/.env
backend/dist
.env.local
.env.*.local
EOF
```

Or manually create `.gitignore` in your project folder with this content:
```
node_modules/
dist/
.env
.DS_Store
*.log
backend/.env
frontend/.env
backend/dist
.env.local
.env.*.local
```

### Step 4: Add All Files

```bash
git add .
```

This stages all your files. The `.` means "everything."

**Verify what's being added:**
```bash
git status
```

You should see:
```
Changes to be committed:
  new file:   README.md
  new file:   backend/package.json
  new file:   frontend/package.json
  ... (many more files)
```

### Step 5: Create First Commit

```bash
git commit -m "Initial commit: Family website with calendar, gallery, and admin dashboard"
```

You should see output showing files being committed.

### Step 6: Set Main Branch

```bash
git branch -M main
```

This renames your branch to `main` (GitHub's default).

### Step 7: Add Remote URL

Go back to your GitHub repository page (the one that was open).

Copy the HTTPS URL shown. It looks like:
```
https://github.com/YOUR_USERNAME/family-website.git
```

Run this command (paste your URL):
```bash
git remote add origin https://github.com/YOUR_USERNAME/family-website.git
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 8: Push to GitHub

```bash
git push -u origin main
```

**First time only:** GitHub may ask for your password:
- Use your GitHub **username**
- Use your GitHub **password** (or personal access token if 2FA enabled)

Wait for it to complete. You should see:
```
Enumerating objects: 250, done.
Counting objects: 100% (250/250), done.
Delta compression using up to 8 threads
Compressing objects: 100% (200/200), done.
Writing objects: 100% (250/250), 5.25 MB
...
To https://github.com/YOUR_USERNAME/family-website.git
 * [new branch]      main -> main
Branch 'main' set to track remote branch 'main' from 'origin'.
```

✅ **Your code is now on GitHub!**

---

## Part 6: Verify on GitHub

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/family-website`
2. You should see all your files
3. Click through folders to verify everything is there:
   - `backend/` folder
   - `frontend/` folder
   - `pictures/` folder
   - `README.md` and other docs

---

## Part 7: Future Updates (Making Changes)

Every time you make changes to your code:

### Step 1: Check Status
```bash
git status
```

Shows which files changed.

### Step 2: Add Changes
```bash
git add .
```

Or add specific files:
```bash
git add backend/src/index.ts
```

### Step 3: Commit
```bash
git commit -m "Fixed login bug"
```

Use descriptive messages:
- ✅ Good: `"Added photo upload feature"`
- ❌ Bad: `"Update"`

### Step 4: Push to GitHub
```bash
git push
```

That's it! Changes automatically deploy to Cloudflare and Railway.

---

## Troubleshooting

### "fatal: not a git repository"

**Fix:** Make sure you're in the right folder:
```bash
pwd  # Shows current folder
cd /Users/chris/ClaudeCowork/Projects/ChrisJonesFamily
git init
```

### "Permission denied (publickey)"

**Fix:** Use HTTPS instead of SSH:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/family-website.git
git push -u origin main
```

### "Please tell me who you are"

**Fix:** Configure Git:
```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
```

### "Everything up-to-date" but nothing shows on GitHub

Check that you added the correct remote:
```bash
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/family-website.git (fetch)
origin  https://github.com/YOUR_USERNAME/family-website.git (push)
```

### "fatal: The current branch main has no upstream branch"

**Fix:** Use:
```bash
git push -u origin main
```

The `-u` flag sets up the tracking.

---

## Verify Everything Works

### Check GitHub
1. Visit: `https://github.com/YOUR_USERNAME/family-website`
2. Verify you see all files
3. Click on a file to preview its content

### Check Git Status
```bash
git status
```

Should show:
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

✅ **Everything is synced!**

---

## Quick Reference

```bash
# First time setup
cd /path/to/ChrisJonesFamily
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/family-website.git
git push -u origin main

# Every time you make changes
git add .
git commit -m "Description of changes"
git push

# Check status
git status

# See your commits
git log
```

---

## What Happens Next

Once code is on GitHub:

1. **Cloudflare Pages** - Auto-deploys frontend when you push
2. **Railway** - Auto-deploys backend when you push
3. **Live Updates** - Your site updates automatically (2-5 min)
4. **No Manual Steps** - Just push and wait

---

## Tips

- **Commit often:** Make commits for each feature/fix
- **Descriptive messages:** Future you will thank you
- **Pull before push:** If working with others, do `git pull` first
- **Create branches:** For bigger features, create a branch:
  ```bash
  git checkout -b feature/photo-upload
  # Make changes
  git push -u origin feature/photo-upload
  ```

---

## Common Git Commands

```bash
# See what changed
git diff

# See commit history
git log

# Undo last commit (local only)
git reset HEAD~1

# Undo changes to a file
git checkout -- filename.txt

# Create a branch
git checkout -b branch-name

# Switch branches
git checkout main

# Delete a branch
git branch -d branch-name

# See all branches
git branch -a
```

---

**Your code is ready to go live! 🚀**

Next steps:
1. Follow the **CLOUDFLARE_RAILWAY_DEPLOYMENT.md** guide
2. Deploy frontend to Cloudflare Pages
3. Deploy backend to Railway
4. Your site will be live in minutes!
