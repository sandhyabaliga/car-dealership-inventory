# AI Prompt Log

## Project
Car Dealership Inventory System — Incubyte TDD assignment.

## AI Assistance
I used ChatGPT to understand test-driven development, plan and implement application features, troubleshoot TypeScript and backend errors, resolve test failures, and verify builds. AI assistance helped me work through errors more efficiently and understand the reasons behind fixes. I reviewed the suggested solutions, ran tests, and verified the application builds. This experience helped me understand the importance of testing, debugging, and validating AI-generated suggestions rather than accepting them blindly.

## Actual Prompts and Conversation Reference
1. Original Conversation — Current Version
https://chatgpt.com/share/6ade2a91-b220-83ee-840b-f6c498994a43

2. Original Conversation — Earlier Version / Recovered Branch


PS C:\Users\sandh\car-dealership\backend> Get-ChildItem jest.config*


    Directory: C:\Users\sandh\car-dealership\backend


Mode                 LastWriteTime         Length Name      
----                 -------------         ------ ----      
-a----        25-10-2026  07:31 PM            247 jest.confi
                                                  g.cjs     


PS C:\Users\sandh\car-dealership\backend>
Perfect! ✅ The file exists. Its name is jest.config.cjs.

Step 1 — Open it in VS Code
Run this command in your backend terminal:

code .\jest.config.cjs

Step 2 — Replace the contents
In VS Code, press Ctrl + A, paste the Jest configuration I gave you in my earlier message, then press Ctrl + S.

Step 3 — Run the tests
Back in PowerShell, run:

npm.cmd test

Send me the output. We're aiming for 2 test suites passed and all 14 tests passed.

PS C:\Users\sandh\car-dealership\backend> npm.cmd test

> backend@1.0.0 test
> jest --runInBand

 PASS  tests/vehicles.test.ts (6.206 s)
 PASS  tests/auth.test.ts

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        8.047 s
Ran all test suites.
PS C:\Users\sandh\car-dealership\backend>
Fantastic! 🎉 Your tests are back to green.

Test suites: 2 passed out of 2

Tests: 14 passed out of 14

Backend build: previously succeeded

Now let's secure your submission by checking Git before pushing. We need to make sure your .env file and local SQLite database aren't accidentally included.

Step 1 — Check your Git changes
In PowerShell, run these commands:

cd "$env:USERPROFILE\car-dealership"
git status --short

Paste the complete output here.

I'll check which files need to be committed and whether any sensitive files appear in the changes. Then we'll commit and push your finished work to your public GitHub repository.

PS C:\Users\sandh\car-dealership> git status --short
 D backend/jest.config.js
 M backend/package.json
 M backend/src/app.ts
 M backend/tsconfig.json
?? backend/jest.config.cjs
?? backend/prisma.config.d.ts
?? backend/prisma.config.d.ts.map
?? backend/prisma.config.js
?? backend/prisma.config.js.map
?? backend/prisma/seed-admin.d.ts
?? backend/prisma/seed-admin.d.ts.map
?? backend/prisma/seed-admin.js
?? backend/prisma/seed-admin.js.map
?? backend/prisma/seed-admin.ts
?? backend/src/app.d.ts
?? backend/src/app.d.ts.map
?? backend/src/app.js
?? backend/src/app.js.map
?? backend/src/server.d.ts
?? backend/src/server.d.ts.map
?? backend/src/server.js
?? backend/src/server.js.map
?? backend/src/server.ts
?? backend/tests/auth.test.d.ts
?? backend/tests/auth.test.d.ts.map
?? backend/tests/auth.test.js
?? backend/tests/auth.test.js.map
?? backend/tests/vehicles.test.d.ts
?? backend/tests/vehicles.test.d.ts.map
?? backend/tests/vehicles.test.js
?? backend/tests/vehicles.test.js.map
?? backend/tests/vehicles.test.ts
?? frontend/
PS C:\Users\sandh\car-dealership>
…
Your Git status shows the frontend and backend changes, but it also reveals an important cleanup task: the backend build generated .js, .d.ts, and .map files in your source folders. Those are build artifacts, and we should keep them out of your submission.

The deleted backend/jest.config.js is expected because we renamed it to jest.config.cjs. We'll keep the new config.

Don't run git add . yet. First, let's clean up the generated files safely.

Step 1 — Remove only the generated files
Run this from your project root, C:\Users\sandh\car-dealership:

Remove-Item `
  backend\prisma.config.d.ts, `
  backend\prisma.config.d.ts.map, `
  backend\prisma.config.js, `
  backend\prisma.config.js.map, `
  backend\prisma\seed-admin.d.ts, `
  backend\prisma\seed-admin.d.ts.map, `
  backend\prisma\seed-admin.js, `
  backend\prisma\seed-admin.js.map, `
  backend\src\app.d.ts, `
  backend\src\app.d.ts.map, `
  backend\src\app.js, `
  backend\src\app.js.map, `
  backend\src\server.d.ts, `
  backend\src\server.d.ts.map, `
  backend\src\server.js, `
  backend\src\server.js.map, `
  backend\tests\auth.test.d.ts, `
  backend\tests\auth.test.d.ts.map, `
  backend\tests\auth.test.js, `
  backend\tests\auth.test.js.map, `
  backend\tests\vehicles.test.d.ts, `
  backend\tests\vehicles.test.d.ts.map, `
  backend\tests\vehicles.test.js, `
  backend\tests\vehicles.test.js.map

This removes only the generated artifacts listed in your Git status. It does not delete your TypeScript source files.

Step 2 — Check Git again
Run:

git status --short

Send me the output. We'll verify the remaining files, then commit and push your changes.

PS C:\Users\sandh\car-dealership> git status --short
 D backend/jest.config.js
 M backend/package.json
 M backend/src/app.ts
 M backend/tsconfig.json
?? backend/jest.config.cjs
?? backend/prisma/seed-admin.ts
?? backend/src/server.ts
?? backend/tests/vehicles.test.ts
?? frontend/
PS C:\Users\sandh\car-dealership>
Perfect! ✅ Your Git status is much cleaner now. The generated build artifacts are gone, and your important source files remain.

Step 1 — Check that secrets and database files are ignored
Run this command from C:\Users\sandh\car-dealership:

git status --short --ignored

Look for these paths in the output:

backend/.env

backend/dev.db

backend/node_modules/

frontend/node_modules/

They should appear as ignored (!!), not as ordinary untracked files (??).

Paste the output here. Then we'll stage the correct files, commit them, and push to GitHub.

PS C:\Users\sandh\car-dealership> git status --short --ignored
 D backend/jest.config.js
 M backend/package.json
 M backend/src/app.ts
 M backend/tsconfig.json
?? backend/jest.config.cjs
?? backend/prisma/seed-admin.ts
?? backend/src/server.ts
?? backend/tests/vehicles.test.ts
?? frontend/
!! backend/.env
!! backend/dist/
!! backend/node_modules/
!! backend/prisma/dev.db
!! frontend/dist/
!! frontend/node_modules/
PS C:\Users\sandh\car-dealership>
Great! ✅ Your sensitive files are correctly ignored by Git:

backend/.env — ignored

backend/prisma/dev.db — ignored

Backend and frontend node_modules/ — ignored

Build output folders — ignored

So these files won't be included just by staging normal project changes. Let's now stage the source code and check the exact list before committing.

Step 1 — Stage your project changes
Run this command from C:\Users\sandh\car-dealership:

git add backend/jest.config.js backend/jest.config.cjs backend/package.json backend/src/app.ts backend/tsconfig.json backend/prisma/seed-admin.ts backend/src/server.ts backend/tests/vehicles.test.ts frontend/

This stages the Jest config rename, backend changes, new tests and admin seed script, and frontend files. It does not stage your .env or local database.

Step 2 — Review what will be committed
Run:

git status

Paste the output here before committing. We'll verify the staged files, then make the final commit and push it to GitHub.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   backend/jest.config.cjs
        deleted:    backend/jest.config.js
        modified:   backend/package.json
        new file:   backend/prisma/seed-admin.ts
        modified:   backend/src/app.ts
        new file:   backend/src/server.ts
        new file:   backend/tests/vehicles.test.ts
        modified:   backend/tsconfig.json
        new file:   frontend/.gitignore
        new file:   frontend/README.md
        new file:   frontend/eslint.config.js
        new file:   frontend/index.html
        new file:   frontend/package-lock.json
        new file:   frontend/package.json
        new file:   frontend/postcss.config.js
        new file:   frontend/public/favicon.svg
        new file:   frontend/public/icons.svg
        new file:   frontend/src/App.css
        new file:   frontend/src/App.tsx
        new file:   frontend/src/assets/hero.png
        new file:   frontend/src/assets/react.svg
        new file:   frontend/src/assets/vite.svg
        new file:   frontend/src/index.css
        new file:   frontend/src/main.tsx
        new file:   frontend/tailwind.config.js
        new file:   frontend/tsconfig.app.json
        new file:   frontend/tsconfig.json
        new file:   frontend/tsconfig.node.json
        new file:   frontend/vite.config.ts
…
Perfect! ✅ The staged files look reasonable, and your .env and database are not included.

One thing to improve before committing: the frontend still contains starter assets such as react.svg and vite.svg. They won't prevent submission, so don't spend time removing them now.

Step 1 — Commit your work
From C:\Users\sandh\car-dealership, run:

git commit -m "Complete car dealership inventory system" -m "Add vehicle inventory UI, admin operations, backend server setup, and test configuration." -m "Co-authored-by: ChatGPT <noreply@openai.com>"

This records your staged changes with an AI co-author trailer.

Step 2 — Push to GitHub
If the commit succeeds, run:

git push origin main

Send me the output from both commands. Then we'll verify that the commit is on your public repository and check whether README.md and PROMPTS.md still need to be added before submission.





