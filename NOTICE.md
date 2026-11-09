# Notice

This **private** repository contains a structured, OCR-derived index of Primary 3 English
past-year examination papers from Singapore schools (2024-2025), compiled for private study and
practice. Question text is reproduced only to the extent needed to identify and practise the item.

- School and paper names are used for attribution only; no endorsement is implied.
- The corpus is not affiliated with, or approved by, any school or examination authority.
- Because the source is OCR, some text may be inaccurate. Items flagged `needs_review` are
  explicitly marked as unverified.
- If you represent a rights holder and would like any content removed, contact the repository
  owner; the material will be taken down promptly.

**Visibility.** The GitHub repository is private and `robots.txt` disallows all indexing.
Do not change the repository to public and do not upload `data/`, `api/`, `offline.html` or
`example.html` to any public host: those files contain the question bank in plaintext.

The only artefact intended for a public host is `deploy/`, which contains `secure/bank.enc`
(AES-256-GCM ciphertext) and the app code that decrypts it in the browser after a passphrase is
entered. Without the passphrase, the published bytes are not readable. Anyone who has both the
URL and the passphrase can read the content, so the passphrase must be shared privately.
