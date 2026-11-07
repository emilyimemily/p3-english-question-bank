# P3 English Question Bank

A **private** browser-based question bank built from **55 Primary 3 English past-year exam
papers (2024-2025, Singapore)**. Everything is static: no server, no database, no tracking.
Open the app on a phone, tablet or laptop and start practising.

- **1,375 questions** from 55 papers (EOY / WA1 / WA2 / WA3)
- Paper builder, timed practice, automatic marking, item-by-item feedback, wrong book
- Works offline after the first visit (PWA + service worker)
- Plain JSON data for any app, script or AI agent **with repository access**
- Entirely in English, including all labels, tags, topics and annotations

> **This repository is PRIVATE. There is no GitHub Pages site.**
> On a GitHub Free account, Pages requires a public repository. On paid plans a Pages site
> built from a private repo is still publicly readable on the internet. To keep the papers
> unreadable while still reachable from anywhere, this repo ships an **encrypted deploy bundle**
> in `deploy/` that can be uploaded to any public static host. See `PUBLISH.md`.

### Three ways to use it

| Route | Who it is for | What is exposed |
| --- | --- | --- |
| `offline.html` (double-click) | One device, no network | Nothing |
| `index.html` over a local static server | Teacher's own machine, or an authenticated internal host | Nothing public |
| `deploy/` uploaded to a static host + passphrase | Students anywhere | **Ciphertext only** |

---

## 1. Just use it

Open any of the routes above. The three tabs are:

| Tab | What it does |
| --- | --- |
| **Paper Builder** | Filter by year, school, exam, question type, objective or topic; generate a printable paper with or without answers. |
| **Student Practice** | Draw random questions, answer them, submit and get per-item feedback with scoring key words. |
| **Wrong Book** | Review errors grouped by topic or type, mark items mastered, and print a revision list. |

**Progress stays in your browser** (`localStorage`). To move it to another device, use
**Export Progress** in the footer on the first device and **Import Progress** on the second.
There is no account and no server-side storage.

**Offline:** `offline.html` has the whole bank embedded, so it can be opened directly from disk
with a double-click (no server needed). The main `index.html` also installs as a PWA on mobile.

### Deep links

Share a link that lands directly on a filtered set:

```
?tab=student&year=2025&topic=Adverbs%20of%20Manner&excludeNeedsReview=1
?tab=teacher&type=Vocabulary%20MCQ&school=Raffles&n=20
?tab=wrongbook
```

Supported parameters: `tab` (`teacher` / `student` / `wrongbook`), `year`, `school`, `exam`,
`type`, `objective`, `topic` (repeatable), `text` (keyword search), `doubt`, `n` (draw count).

---

## 2. Consume the data from anywhere

Because the repository is private, **`raw.githubusercontent.com` and jsDelivr CDN links do not
work anonymously**. jsDelivr does not serve private repositories at all. Choose one of these:

### A. Encrypted deploy host (recommended for students)

`deploy/` contains only `secure/bank.enc` (AES-256-GCM ciphertext). The SDK decrypts it in the
browser after the user supplies the passphrase:

```js
await P3Bank.loadSecure('the-passphrase');       // from the deploy host
const items = P3Bank.random(10, { year: 2025 });
```

No token is involved, so this is the only route that is safe to expose on a public URL.

### B. Authenticated GitHub raw (server-side only)

```bash
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://raw.githubusercontent.com/emilyimemily/p3-english-question-bank/main/data/question_bank.json
```

```js
await P3Bank.load({
  url: '/api/bank',                              // your server-side proxy
  headers: { Authorization: 'Bearer ' + token } // keep the token off the client
});
```

**Never paste a GitHub token into browser JavaScript, a static page or a shared URL.** Put the
token on a server you control, or use a GitHub App / OAuth installation token.

### C. Local files

`data/question_bank.json` (full bank), `data/vocab.json` (vocabulary index),
`api/papers.json`, `api/questions.json` (lightweight index) and `api/stats.json` are all plain
JSON. Serve this folder locally and call `P3Bank.load()` with no arguments.

### Question fields

`id`, `paper`, `year`, `school`, `school_full`, `exam`, `no`, `section`, `type`, `objective`,
`topic`, `tags`, `stem`, `passage`, `options`, `answer`, `answer_text`, `keywords`,
`explanation`, `review`, `wrong_hints`, `marks`, `difficulty`, `my_answer`, `verdict`,
`doubt`, `doubt_reason`, `grading_note`, `needs_review`, `source_page`, `source_file`.

`verdict` is `correct` / `wrong` / `doubt` / `unattempted` (the independent-attempt record).
`needs_review` marks items whose OCR or official answer could not be verified.

### SDK

```html
<script src="./sdk/question-bank.js"></script>
<script>
  await P3Bank.load();                                  // local, same-origin plaintext JSON
  // await P3Bank.loadSecure('the-passphrase');        // encrypted deploy host
  const items  = P3Bank.random(10, { year: 2025, type: 'Vocabulary MCQ' });
  const result = P3Bank.grade(items[0], '2');          // { score, correct, marks }
</script>
```

`P3Bank` also exposes `all()`, `byId()`, `filter()`, `stats()`, `papers` and `meta`.
When loaded from the same root it auto-detects the base URL, so `P3Bank.load()` needs no argument.
See **`example.html`** for a complete working quiz built with the SDK.

You can embed the deployed app in an iframe (the student still has to unlock it once):

```html
<iframe src="https://YOUR-DEPLOY-HOST/?tab=student&n=10"
        width="100%" height="900" style="border:0" title="P3 English Practice"></iframe>
```

---

## 3. Repository layout

```
index.html                  Main app (English UI, loads data over HTTP)
offline.html                Same app with the bank embedded, works from file://
data/question_bank.json     Full English question bank - PRIVATE, never upload
data/vocab.json             Vocabulary frequency index - PRIVATE, never upload
api/papers.json             55-paper index
api/questions.json          Lightweight question index for search/filter
api/stats.json              Pre-computed distributions
sdk/question-bank.js        Zero-dependency SDK (load / loadSecure)
example.html                Working SDK integration demo
deploy/index.html           Password-gated app for a public static host
deploy/secure/bank.enc      AES-256-GCM ciphertext - the only public data
deploy/sdk/                 SDK with loadSecure() for third-party integration
deploy/README.txt           Upload instructions for the encrypted bundle
manifest.webmanifest / sw.js / icons/   PWA offline support
robots.txt                  Disallow all indexing
NOTICE.md                   Source and copyright note
PUBLISH.md                  Private-repo + encrypted-deploy checklist
```

## 4. Publishing

See **`PUBLISH.md`** for the full checklist. In short:

1. Create an **empty PRIVATE** repository on GitHub and push the `main` branch.
2. There is **no GitHub Pages step** - it is deliberately not used (see the note at the top).
3. Upload the contents of `deploy/` to any HTTPS static host and share the site URL plus the
   passphrase with students. Only encrypted bytes are public.

The passphrase lives outside the repository in `work/deploy_password.txt` (local build machine),
or in the `P3_BANK_PASSPHRASE` environment variable. Regenerating `deploy/` with a new passphrase
rotates access. `deploy/` itself contains no secret.

To update the bank, replace the private `data/question_bank.json` and `api/*.json`, commit and
push, then rerun the build and re-upload `deploy/` so students receive the refreshed ciphertext.

## 5. Data quality

These papers were scanned PDFs, so the bank was produced with OCR and then structured
automatically. Please read this before relying on a score:

- **557 items are flagged `needs_review`** with an English `doubt_reason` and the source file/page.
  Typical causes: watermark over the answer sheet, fewer than four options recognised, or a
  truncated stem.
- **427 items have no detected official answer** and are marked `Official Answer Missing`.
  They were **not guessed**.
- Visual-text and comprehension items need the original poster/passage; OCR does not preserve
  images or full passages.
- Open-ended items are graded against `keywords` (scoring key words) and should be reviewed by a
  teacher.
- 479 multiple-choice items were attempted independently before consulting the answer keys:
  230 correct, 45 incorrect, 204 flagged as doubtful.

All annotations, topics, review notes and interface text are in English. Chinese glosses from the
original working files are deliberately **not** published here.

See `NOTICE.md` for sources and takedown information.
