# Publishing - PUBLIC repository

**Live site:** https://emilyimemily.github.io/p3-english-question-bank/
**Repository:** https://github.com/emilyimemily/p3-english-question-bank

This is a **public** repository served by GitHub Pages, exactly like
`p3-science-bank`. There is no password, no encryption, no build step and no
extra hosting platform. Anyone with the link can open the site and practise.

| Setting | Value |
| --- | --- |
| Visibility | **Public** |
| Pages source | **Deploy from a branch** - `main` / `/ (root)` |
| Build type | Legacy (static files served verbatim) |
| Custom domain | None |
| `.nojekyll` | Present, so Jekyll does not process the files |

## Daily use

- Students: open https://emilyimemily.github.io/p3-english-question-bank/ on any phone, tablet or computer.
- Offline: `offline.html` has the whole bank embedded; double-click it.
- Programs / AI tools: fetch `data/question_bank.json` or the lightweight
  `api/*.json` indexes from `raw.githubusercontent.com` or jsDelivr. See `README.md`.
- Teachers: **Paper Builder** tab filters by year, school, exam, type and topic
  and prints a paper with or without answers.

## Updating the bank

Replace `data/question_bank.json` (and the derived `api/*.json`), then:

```bash
git add -A && git commit -m "Update question bank" && git push
```

Pages republishes from `main` automatically. `.nojekyll` must stay in the repo.
The service worker keeps serving the cached copy while it refreshes in the
background, so visitors see the new data on their next reload.

## Reverting to private

Repo **Settings > Danger Zone > Change visibility** to Private, and turn Pages
off in **Settings > Pages**. Note that exam-paper text, answers and annotations
in a public repo may already have been indexed or cached by search engines and
CDNs; making the repo private again cannot recall those copies.

## Access policy

`robots.txt` currently allows indexing. To reduce search-engine exposure, change
`Allow: /` to `Disallow: /` and push. See `NOTICE.md` for source attribution and
takedown information.

## Scanned questions

Each question ships its OWN cropped screenshot from the PDF - never a whole
exam page, so a Comprehension Cloze item can never show a Sentence Manipulation
item printed on the same page. `visuals/<pdf-stem>/` holds `pNN.jpg` source
pages plus `c_*.jpg` (one cloze/editing passage with its numbered blanks),
`a_*.jpg` (reading passage with the white margins removed), `q_*.jpg` and
`s_*.jpg` (one individual question). Every reading, cloze, editing, synthesis,
table and matching item is answered on its scan: text boxes are placed on the
printed blanks and there is a mirrored answer row below. Rebuilding requires
`work/build_visuals.py` followed by `work/build_cloud.py`.
