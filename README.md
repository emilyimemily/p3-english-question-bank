# P3 English Question Bank

A free, public, browser-based question bank built from **55 Primary 3 English past-year exam
papers (2024-2025, Singapore)**. Everything is static: no server, no database, no API key, no
tracking. Open the link on a phone, tablet or laptop and start practising.

- **1,375 questions** from 55 papers (EOY / WA1 / WA2 / WA3)
- Paper builder, timed practice, automatic marking, item-by-item feedback, wrong book
- Works offline after the first visit (PWA + service worker)
- **Open JSON data** so any app, script or AI agent can consume the bank
- Entirely in English, including all labels, tags, topics and annotations

> **Live site:** `https://YOUR_GITHUB_USERNAME.github.io/p3-english-question-bank/`
> After publishing, replace `YOUR_GITHUB_USERNAME` in the URLs below with your GitHub login.
> For local use, simply open `index.html` through any static server.

---

## 1. Just use it

Open the live URL. The three tabs are:

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

All JSON is plain static files with permissive CORS on jsDelivr, so it can be fetched directly
from a browser, a script, a notebook or an LLM tool.

| What | Raw GitHub | jsDelivr CDN |
| --- | --- | --- |
| Full bank (stems, options, answers, explanations, tags) | `https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/p3-english-question-bank/main/data/question_bank.json` | `https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/p3-english-question-bank@main/data/question_bank.json` |
| Vocabulary index | `data/vocab.json` | same path on the CDN |
| Paper list | `api/papers.json` | same path on the CDN |
| Lightweight question index | `api/questions.json` | same path on the CDN |
| Aggregate statistics | `api/stats.json` | same path on the CDN |

```js
const res  = await fetch('https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/p3-english-question-bank@main/data/question_bank.json');
const bank = await res.json();
console.log(bank.questions.length);   // 1375
```

### Question fields

`id`, `paper`, `year`, `school`, `school_full`, `exam`, `no`, `section`, `type`, `objective`,
`topic`, `tags`, `stem`, `passage`, `options`, `answer`, `answer_text`, `keywords`,
`explanation`, `review`, `wrong_hints`, `marks`, `difficulty`, `my_answer`, `verdict`,
`doubt`, `doubt_reason`, `grading_note`, `needs_review`, `source_page`, `source_file`.

`verdict` is `correct` / `wrong` / `doubt` / `unattempted` (the independent-attempt record).
`needs_review` marks items whose OCR or official answer could not be verified.

### 3-line SDK

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/p3-english-question-bank@main/sdk/question-bank.js"></script>
<script>
  await P3Bank.load('https://cdn.jsdelivr.net/gh/YOUR_GITHUB_USERNAME/p3-english-question-bank@main');
  const items  = P3Bank.random(10, { year: 2025, type: 'Vocabulary MCQ' });
  const result = P3Bank.grade(items[0], '2');   // { score, correct, marks }
</script>
```

`P3Bank` also exposes `all()`, `byId()`, `filter()`, `stats()`, `papers` and `meta`.
When loaded from the same repo it auto-detects the base URL, so `P3Bank.load()` needs no argument.
See **`example.html`** for a complete working quiz built with the SDK.

You can also embed the whole app in an iframe:

```html
<iframe src="https://YOUR_GITHUB_USERNAME.github.io/p3-english-question-bank/?tab=student&n=10"
        width="100%" height="900" style="border:0" title="P3 English Practice"></iframe>
```

---

## 3. Repository layout

```
index.html                  Main app (English UI, loads data over HTTP)
offline.html                Same app with the bank embedded, works from file://
data/question_bank.json     Full English question bank
data/vocab.json             Vocabulary frequency index
api/papers.json             55-paper index
api/questions.json          Lightweight question index for search/filter
api/stats.json              Pre-computed distributions
sdk/question-bank.js        Zero-dependency SDK
example.html                Working SDK integration demo
manifest.webmanifest / sw.js / icons/   PWA offline support
.github/workflows/pages.yml Optional Actions-based Pages deploy
robots.txt                  Search-engine policy
NOTICE.md                   Source and copyright note
```

## 4. Publishing (GitHub Pages)

From the repo **Settings > Pages**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`,
and save. The site appears at `https://YOUR_GITHUB_USERNAME.github.io/p3-english-question-bank/` within a minute or two.
The included workflow is an alternative if you prefer **GitHub Actions** as the source.
`.nojekyll` is present so GitHub does not run Jekyll over the static files.

To update the question bank, replace `data/question_bank.json` (and the derived `api/*.json`) and
push. Visitors get the new data on their next reload; the service worker serves the cached copy
while it refreshes in the background.

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
