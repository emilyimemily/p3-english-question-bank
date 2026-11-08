# P3 English Question Bank

A free, public, browser-based question bank built from **55 Primary 3 English past-year exam
papers (2024-2025, Singapore)**. Everything is static: no server, no database, no API key, no
tracking. Open the link on a phone, tablet or laptop and start practising.

- **1,375 questions** from 55 papers (EOY / WA1 / WA2 / WA3)
- Paper builder, timed practice, automatic marking, item-by-item feedback, wrong book
- Works offline after the first visit (PWA + service worker)
- **Open JSON data** so any app, script or AI agent can consume the bank
- Entirely in English, including all labels, tags, topics and annotations
- **Image-first answering**: full passage scans, per-question crops and answer boxes printed on the blanks (no OCR text shown as the question)

> **Live site:** https://emilyimemily.github.io/p3-english-question-bank/
> Public repository; GitHub Pages serves `main` / `/ (root)` - the same setup as
> `p3-science-bank`. No password, no build step.
> For local use, open `index.html` via any static server, or double-click `offline.html`.

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
| Full bank (stems, options, answers, explanations, tags) | `https://raw.githubusercontent.com/emilyimemily/p3-english-question-bank/main/data/question_bank.json` | `https://cdn.jsdelivr.net/gh/emilyimemily/p3-english-question-bank@main/data/question_bank.json` |
| Vocabulary index | `data/vocab.json` | same path on the CDN |
| Paper list | `api/papers.json` | same path on the CDN |
| Lightweight question index | `api/questions.json` | same path on the CDN |
| Aggregate statistics | `api/stats.json` | same path on the CDN |

```js
const res  = await fetch('https://cdn.jsdelivr.net/gh/emilyimemily/p3-english-question-bank@main/data/question_bank.json');
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
<script src="https://cdn.jsdelivr.net/gh/emilyimemily/p3-english-question-bank@main/sdk/question-bank.js"></script>
<script>
  await P3Bank.load('https://cdn.jsdelivr.net/gh/emilyimemily/p3-english-question-bank@main');
  const items  = P3Bank.random(10, { year: 2025, type: 'Vocabulary MCQ' });
  const result = P3Bank.grade(items[0], '2');   // { score, correct, marks }
</script>
```

`P3Bank` also exposes `all()`, `byId()`, `filter()`, `stats()`, `papers` and `meta`.
When loaded from the same repo it auto-detects the base URL, so `P3Bank.load()` needs no argument.
See **`example.html`** for a complete working quiz built with the SDK.

You can also embed the whole app in an iframe:

```html
<iframe src="https://emilyimemily.github.io/p3-english-question-bank/?tab=student&n=10"
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
.nojekyll                   Disables Jekyll so Pages serves the files verbatim
robots.txt                  Search-engine policy
NOTICE.md                   Source and copyright note
```

## 4. Publishing (GitHub Pages)

Already published. **Settings > Pages** is set to **Deploy from a branch**, branch
`main`, folder `/ (root)`; the site is at https://emilyimemily.github.io/p3-english-question-bank/
There is no build step and no Actions workflow - pushing to `main` republishes the
static files. `.nojekyll` is present so GitHub does not run Jekyll over them.

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


## 6. Scanned, fillable questions

The app is **image first**. OCR text is never shown as the passage or the
question for passage-based items: the original scan is the authoritative
version.  Each of the 827 visual questions carries a `visual` object:

| Field | Meaning |
| --- | --- |
| `mode` | `reading`, `cloze`, `editing`, `synthesis`, `truefalse`, `tick` or `matching` |
| `article_images` | Complete, untruncated scans of the whole passage / exercise page(s) |
| `article_wh` / `question_wh` | Pixel size of each scan, so the page reserves its space before the picture loads |
| `question_images` | A crop of that individual question from the original paper |
| `overlays` | Answer boxes positioned (in percent) on the scan's printed blanks, each with the `owner` question and a unique `part` key |
| `table` | Editable True/False grid: text fields or tick boxes in the cells |
| `lines` | Enables freehand connecting lines on the scan for matching items |

Behaviour by item type:

- **Reading comprehension** - full passage scan, then the question scan, then the
  answer field directly below the question scan (option buttons for multiple
  choice, a text box for open answers). The article is never truncated to fit
  one question.
- **Comprehension / Grammar / Vocabulary Cloze** - the whole passage is scanned
  and **every printed blank of that passage carries a fillable box**. Each box
  belongs to the question printed next to it, so the whole passage can be
  completed on the scan; an "Your answer" row below the scan mirrors the box of
  the current question and stays in sync with it.
- **Editing** - the whole exercise is scanned with a box at the correction.
- **Sentence synthesis** - each sub-question is cropped; every underlined part
  gets its own box. With a printed connector, boxes appear before and after it.
  The rule that underlines the printed sentence is not treated as an answer line.
- **True / False tables** - an HTML table with text fields, or tick boxes when
  the paper says "tick".
- **Matching** - drag on the scan to draw connecting lines (a text answer is
  also accepted).

The same layout is used in the paper builder, practice, feedback and wrong book
views; only the printable copy uses empty dashed answer lines. Build a paper in
the Paper Builder, press "Practice online (auto-graded)" and students answer on
the web, typing straight into the boxes on each question's own scan. Every
on-screen view is fillable. Keep `visuals/` next to `index.html` for offline
copies.
