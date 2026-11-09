P3 English Question Bank - encrypted deployment bundle
======================================================

This folder is SAFE to upload to a PUBLIC static host. It contains no readable
questions, answers, passages or annotations.

  secure/bank.enc    AES-256-GCM encrypted question bank (ciphertext only)
  index.html         asks for a passphrase, decrypts in the browser
  sdk/               SDK with P3Bank.loadSecure(passphrase)
  sw.js              offline cache for the encrypted file
  manifest / icons   PWA install support
  robots.txt         disallows search-engine indexing
  .nojekyll          static-host marker

HOW TO PUBLISH
  1. Upload the CONTENTS of this folder (not the folder itself) to any static
     host, for example Netlify Drop (app.netlify.com/drop) or Cloudflare Pages
     > Create a project > Direct Upload. No GitHub repository is needed.
  2. HTTPS is REQUIRED: browsers expose crypto.subtle only on HTTPS and on
     http://localhost. A plain http:// site cannot decrypt the bank.
  3. Share the site URL and the passphrase with students through separate
     channels. The passphrase is NOT in this folder and NOT in the git repo.
  4. Students open the URL, type the passphrase once, and can then use the
     Paper Builder, Student Practice and Wrong Book tabs. Reloading asks again;
     the encrypted file itself is cached for offline use.

SECURITY NOTES
  - The passphrase is used only in the browser (PBKDF2-SHA256 -> AES-256-GCM).
    It is never transmitted and never written to localStorage.
  - Wrong-book entries are stored in the student's own browser only.
  - Anyone who knows both the URL and the passphrase can read the bank. Treat
    the passphrase like a password; rotate it if it leaks.
  - To rotate the passphrase, delete work/deploy_password.txt (or set the
    P3_BANK_PASSPHRASE environment variable), rerun build_cloud.py and
    re-upload the regenerated deploy/ folder. Existing links keep working but
    require the new passphrase.
  - NEVER upload data/, api/, offline.html or example.html from the private
    repository: those contain the question bank in plaintext.

The source repository is PRIVATE and deliberately does not use GitHub Pages:
on a GitHub Free account Pages requires a public repo, and even on paid plans
a Pages site built from a private repo is still publicly readable.
