# P3 English Question Bank

A free, public, browser-based question bank built from **55 Primary 3 English past-year exam
papers (2024-2025, Singapore)**. Everything is static: no server, no database, no API key, no
tracking. Open the link on a phone, tablet or laptop and start practising.

- **1,151 questions** from 55 papers (EOY / WA1 / WA2 / WA3)
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
| **Paper Builder** | Filter by year, school, exam, question type, objective or topic; generate a printable paper. The paged preview shows one question per screen with a **Submit** button that instantly marks it and shows the score and reference answer. |
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
console.log(bank.questions.length);   // 1151
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
version.  Every passage-based question carries a `visual` object:

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
  completed on the scan. There is deliberately no second row of answer fields
  below the picture - the boxes on the scan are the only answer inputs. Blank
  page margins above and below the crop are removed.
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


## 7. Practice online (one question at a time)

Press **Practice online (auto-graded)** in the Paper Builder to start a session.
The screen shows exactly ONE big question (one passage / one article) at a time:

| Control | Where | What it does |
| --- | --- | --- |
| **Submit answer** | bottom right | Grades the current question and only then reveals its score, the reference answer and the explanation. The inputs lock so the answer cannot be changed afterwards. |
| **Next question** | bottom right | Appears after submitting; moves on to the next question. |
| **Previous question** | bottom left | Steps back through questions already done, with their answers and scores still visible. |
| **Back to Question N** | bottom left | Shown while reviewing an old question; jumps straight back to the question the student was working on (e.g. reviewing set 1 while set 4 was done resumes at set 5). |
| **View results** | top / bottom right | Once every question is submitted, scrolls to the score, accuracy, time and mistake chart. |

Progress (`n / N submitted`) and a progress bar are always visible. The same
fillable scans are used on desktop and phone.


## 8. Submit and instant marking in the Paper Builder

The generated paper preview is also a student answer sheet - one big question
(one passage) per screen, with a **Submit answer** button on EVERY page.
Nothing is marked or revealed before that button is pressed.

| After Submit | What the student sees |
| --- | --- |
| Correct / Incorrect / Partial marks | Whether the answer was right |
| Score X / Y | Marks for this question (cloze and editing are scored blank by blank) |
| Reference answer | The official answer from the original paper |
| Your answer + explanation | What was typed, plus the item's topic and explanation |

Submitted pages lock their inputs but keep the result visible when the student
uses **Previous question** or **Jump to** to look back. The progress line shows
`k / N submitted` and the running total score; when every page is submitted a
**Paper complete** card shows the total. **Back to Question N** jumps straight
to the first unanswered question.

Every question type can be answered and submitted this way: multiple choice
(option buttons below the scan), cloze / editing / synthesis (boxes on the
printed blanks), True / False tables (cells), reading comprehension and other
open answers (text box below the question scan), and matching (lines on the
scan). A few original papers contain no answer section; those items are marked
**Needs teacher checking** instead of being wrongly scored as zero, and offer
**I was right / I was wrong** self-correction buttons to record a score.


## 9. Answer audit (independent attempt vs original answer key)

Every one of the 1151 questions has an `answer_audit` record, shown next to
**Reference answer**. Where the scan text allowed, the question was attempted
independently BEFORE the paper's answer key was consulted; the remaining items
are checked for internal consistency and explicitly marked as unverifiable.

| Status | Meaning |
| --- | --- |
| `verified` | Our independent attempt matched the paper's key. |
| `questionable` | The key disagrees with our attempt, is incomplete, or is not a valid option. Both versions are accepted when marking. |
| `ocr_fixed` | The answer-sheet OCR was corrected (missing spaces, misspellings, page footers). The raw OCR text is still shown. |
| `unverifiable` | The scan text was too incomplete to re-solve; teacher check recommended. |
| `no_key` | The original paper contained no answer key for this item, so it is never auto-marked. |

Totals: 116 questionable, 92 OCR-corrected, 97 verified,
517 unverifiable, 329 with no key. Questionable items can be
listed with the **doubt / review** filter in the Paper Builder. Where the
paper's own key is debatable (for example 2025 EOY Rosyth Q32-34: the answer
sheet says `list / costs / buying`, while `list / prices / paying` also fits),
the Reference answer shows both and grading accepts either.
