# Publishing checklist

**Current state:** the site is built, fully validated and committed in this local git repository.
It has **not** been pushed yet, because this session has no active GitHub credential.

## Option A - GitHub connector (preferred)

1. In WorkBuddy, open the **+** menu at the bottom-left, enable the **GitHub** connector and sign in.
2. Say *"push it"* in the chat.
3. The assistant creates the public repository `p3-english-question-bank`, pushes the `main`
   branch, enables GitHub Pages (source: branch `main`, folder `/ (root)`), and verifies the live URL.
4. The assistant replaces `YOUR_GITHUB_USERNAME` in `README.md` with your actual login.

## Option B - push from your own terminal

1. Create a **new empty public repository** named `p3-english-question-bank` on GitHub.
   Do **not** add a README, license or .gitignore (an empty repo avoids a merge conflict).
2. Run:

   ```bash
   cd <this folder>
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/p3-english-question-bank.git
   git push -u origin main
   ```

   Git Credential Manager will open a browser window for sign-in. Nothing needs to be shared
   with the assistant.
3. In the repo go to **Settings > Pages**, choose **Deploy from a branch**, branch `main`,
   folder `/ (root)`, and Save. The site goes live at
   `https://YOUR_GITHUB_USERNAME.github.io/p3-english-question-bank/` within a minute or two.
4. Replace `YOUR_GITHUB_USERNAME` in `README.md` and commit the change.

## Option C - keep it local

Run `python -m http.server 8000` in this folder and open `http://localhost:8000/`.
`offline.html` also works with a plain double-click, with no server at all.

## After publishing - verify

| Check | Expected |
| --- | --- |
| `/` | The English app with "P3 English Question Bank" |
| `/data/question_bank.json` | Valid JSON, `meta.questions` = 1375 |
| `/api/stats.json` | Valid JSON totals |
| `/manifest.webmanifest` | Valid JSON (PWA installable) |
| `/example.html` | SDK demo loads and can draw questions |

## Notes

- This is a **public** repository. Exam-paper text, answers and annotations are visible to
  anyone and may be cached by search engines and CDNs. See `NOTICE.md` for takedown information
  and `robots.txt` if you later want to block indexing.
- To update the bank, replace `data/question_bank.json` plus the derived `api/*.json`, commit and
  push. Pages republishes automatically.
