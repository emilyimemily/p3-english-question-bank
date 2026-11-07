# Publishing checklist - PRIVATE repository

**Current state:** built, fully validated and published to the **PRIVATE** repository
`https://github.com/emilyimemily/p3-english-question-bank`. Everything below documents the
procedure for reference and assumes the repository stays **private**.

## Why there is no GitHub Pages step

Per GitHub's documentation:

- On **GitHub Free**, a repository that publishes Pages **must be public**. Make it private and
  the site stops serving.
- On **Pro / Team / Enterprise**, Pages can be built from a private repository, but the
  published site is **still publicly readable on the internet**: "GitHub Pages sites are publicly
  available on the internet, even if the repository for the site is private."
- Truly private Pages sites require **GitHub Enterprise Cloud** with an organisation account.

So Pages cannot satisfy both "private" and "reachable from anywhere without exposing the papers".
This repo uses a private GitHub repository plus an **encrypted static bundle** instead.

---

## Step 1 - create the PRIVATE repository

On GitHub, click **New repository** and set:

| Field | Value |
| --- | --- |
| Repository name | `p3-english-question-bank` |
| Visibility | **Private** |
| README / .gitignore / license | **Leave all off** (empty repo avoids a merge conflict) |

Copy the repository URL GitHub shows you.

## Step 2 - push from your own terminal

```bash
cd "C:\Users\seren\WorkBuddy\2026-11-07-16-00-47\p3-english-question-bank"
git remote add origin https://github.com/emilyimemily/p3-english-question-bank.git
git push -u origin main
```

The initial push was made with the GitHub CLI credential already stored on this machine
(`emilyimemily`, OAuth scope `repo`); no token is stored in the repository. If you push again
yourself, Git Credential Manager opens a browser window for sign-in.

**Verify:** the repo page shows a **Private** badge. Do **not** enable Pages.

<details>
<summary>Optional: use the WorkBuddy GitHub connector instead</summary>

The connector is not installed in this session. In the client, open **Connectors** in the left
sidebar (or the connector icon / **+** near the message box, then **More Connectors**), search
for **GitHub**, click the **+** / **Connect** button and finish the browser OAuth flow. Once the
status reads Connected, ask the assistant to create a private repository and push. If your build
does not list GitHub, use Step 2 instead.

Official connector reference:
`https://www.workbuddy.ai/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Connector`
</details>

## Step 3 - publish the encrypted bundle (students from anywhere)

Upload the **contents** of the `deploy/` folder - not the folder itself - to any static host:

- **Netlify Drop**: `https://app.netlify.com/drop` - drag the folder contents in, get an HTTPS URL.
- **Cloudflare Pages** > Create a project > **Direct Upload** - upload the folder contents.
- Any static host that serves **HTTPS** (required: browsers expose `crypto.subtle` only on HTTPS
  and `http://localhost`).

Then share two things with students **through separate channels**:

1. the site URL,
2. the passphrase.

The passphrase is **not** in the git repository and **not** in `deploy/`. It is stored on this
build machine at `work/deploy_password.txt` (or supplied via the `P3_BANK_PASSPHRASE`
environment variable). Students open the URL, enter the passphrase once and can use all three
tabs. The encrypted file is cached by the service worker, so the page also unlocks offline.

## Step 4 - verify

| Check | Expected |
| --- | --- |
| Repo visibility | **Private** badge on GitHub |
| `https://<host>/` | "Unlock the question bank" passphrase screen |
| Correct passphrase | English app, 1,375 questions, three tabs |
| Wrong passphrase | "Incorrect passphrase. Please try again." |
| `https://<host>/secure/bank.enc` | Opaque base64/JSON ciphertext, no question text |
| `https://<host>/robots.txt` | `Disallow: /` |
| `https://<host>/data/question_bank.json` | **404** (must not exist) |
| Anonymous `raw.githubusercontent.com/.../data/question_bank.json` | **404** (private repo) |

## Step 5 - optional integrations

- **Program / AI tool**: fetch the private JSON with `Authorization: Bearer <PAT>` from a
  server-side proxy, or call `P3Bank.loadSecure(passphrase)` against the deploy host.
- **Never** place a GitHub token in browser JavaScript, a static page or a shared URL.
- **Rotate the passphrase**: delete `work/deploy_password.txt` (or set a new
  `P3_BANK_PASSPHRASE`), rerun `build_cloud.py`, re-upload `deploy/`, commit and push.
- **Keep it entirely local**: `python -m http.server 8000` in the repo folder, or just
  double-click `offline.html`. No upload at all.

## What must NEVER be uploaded

`data/`, `api/`, `offline.html`, `example.html`, `question_bank.json`, the original scanned PDFs,
and `work/deploy_password.txt`. All of these contain plaintext or secrets. Only `deploy/` is
safe for a public host.
