/*!
 * P3 English Question Bank - zero-dependency SDK
 * Include this file, then call:  await P3Bank.load();
 * Auto-detects the root from the script URL, so it works on any static host.
 * Private repo:  await P3Bank.load({ url: rawUrl, headers: { Authorization: 'Bearer <PAT>' } });
 * Encrypted host: await P3Bank.loadSecure('the-passphrase');
 * NEVER put a GitHub token in browser code - use a server-side proxy.
 */
(function (global) {
  'use strict';
  var SELF = (document.currentScript && document.currentScript.src) || '';
  function defaultBase() {
    if (!SELF) return './';
    return new URL('../', SELF).href;
  }
  function join(base, path) {
    return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
  }
  var bank = null, byId = null;

  function ingest(data) {
    if (!data || !Array.isArray(data.questions)) throw new Error('P3Bank: invalid payload');
    bank = data;
    byId = new Map();
    data.questions.forEach(function (q) { byId.set(String(q.id), q); });
    return P3Bank;
  }
  function b64bytes(s) {
    var bin = atob(String(s));
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  var P3Bank = {
    version: '1.1.0',
    /** Load plaintext JSON. Accepts a base URL string, or { url, headers, base }. */
    load: function (arg) {
      var o = (typeof arg === 'string') ? { base: arg } : (arg || {});
      var url = o.url || join(o.base || defaultBase(), 'data/question_bank.json');
      var init = o.headers ? { headers: o.headers } : {};
      return fetch(url, init).then(function (r) {
        if (!r.ok) throw new Error('P3Bank.load: HTTP ' + r.status + ' for ' + url);
        return r.json();
      }).then(ingest);
    },
    /** Load the AES-256-GCM encrypted bundle from an encrypted deploy host. */
    loadSecure: function (passphrase, base, bundleName) {
      var url = join(base || defaultBase(), bundleName || 'secure/bank.enc');
      if (!(globalThis.crypto && crypto.subtle))
        return Promise.reject(new Error('P3Bank.loadSecure: Web Crypto needs HTTPS or localhost'));
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error('P3Bank.loadSecure: HTTP ' + r.status + ' for ' + url);
        return r.json();
      }).then(function (bundle) {
        var enc = new TextEncoder();
        return crypto.subtle.importKey('raw', enc.encode(String(passphrase)), 'PBKDF2', false, ['deriveKey'])
          .then(function (rawKey) {
            return crypto.subtle.deriveKey(
              { name: 'PBKDF2', salt: b64bytes(bundle.salt), iterations: bundle.iter, hash: 'SHA-256' },
              rawKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
          })
          .then(function (key) {
            return crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64bytes(bundle.iv) },
                                         key, b64bytes(bundle.data));
          })
          .then(function (plain) { return ingest(JSON.parse(new TextDecoder().decode(plain))); });
      });
    },
    get bank() { return bank; },
    get meta() { return bank && bank.meta; },
    get papers() { return (bank && bank.papers) || []; },
    all: function () { return (bank && bank.questions) || []; },
    byId: function (id) { return byId ? byId.get(String(id)) || null : null; },
    /** Filter: { year, school, exam, type, topic, keyword, needsReview, excludeNeedsReview } */
    filter: function (o) {
      o = o || {};
      var kw = o.keyword ? String(o.keyword).toLowerCase() : '';
      var dims = ['year', 'school', 'exam', 'type', 'topic'];
      return P3Bank.all().filter(function (q) {
        for (var i = 0; i < dims.length; i++) {
          var k = dims[i];
          if (o[k] !== undefined && o[k] !== null && o[k] !== '' &&
              String(q[k]) !== String(o[k])) return false;
        }
        if (o.needsReview === true && !q.needs_review) return false;
        if (o.excludeNeedsReview && q.needs_review) return false;
        if (kw) {
          var blob = [q.stem, q.passage, (q.keywords || []).join(' '),
                      Object.values(q.options || {}).join(' ')].join(' ').toLowerCase();
          if (blob.indexOf(kw) < 0) return false;
        }
        return true;
      });
    },
    /** Draw n random questions (optionally pre-filtered with the same options object). */
    random: function (n, criteria) {
      var pool = P3Bank.filter(criteria).slice();
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      return pool.slice(0, Math.max(0, n || 10));
    },
    /** Grade an answer. MCQ: exact key. Open-ended: partial credit on scoring key words. */
    grade: function (q, answer) {
      var marks = Number(q.marks) > 0 ? Number(q.marks) : 1;
      var ans = (answer === null || answer === undefined) ? '' : String(answer).trim();
      if (q.options && Object.keys(q.options).length) {
        return { score: ans === String(q.answer) ? marks : 0,
                 correct: ans === String(q.answer), marks: marks };
      }
      var kws = (q.keywords || []).filter(function (k) { return String(k).trim(); });
      var text = ans.toLowerCase();
      if (!text) return { score: 0, correct: false, marks: marks };
      if (kws.length) {
        var hits = kws.filter(function (k) { return text.indexOf(String(k).toLowerCase()) >= 0; }).length;
        if (hits === kws.length) return { score: marks, correct: true, marks: marks };
        if (hits >= 1) return { score: Math.ceil(marks / 2), correct: false, marks: marks };
        return { score: 0, correct: false, marks: marks };
      }
      var ref = String(q.answer_text || q.answer || '').trim().toLowerCase();
      var ok = text === ref;
      return { score: ok ? marks : 0, correct: ok, marks: marks };
    },
    stats: function () {
      var out = { total: 0, byType: {}, byTopic: {}, byYear: {}, needsReview: 0 };
      P3Bank.all().forEach(function (q) {
        out.total++;
        out.byType[q.type] = (out.byType[q.type] || 0) + 1;
        out.byTopic[q.topic] = (out.byTopic[q.topic] || 0) + 1;
        out.byYear[q.year] = (out.byYear[q.year] || 0) + 1;
        if (q.needs_review) out.needsReview++;
      });
      return out;
    }
  };
  global.P3Bank = P3Bank;
})(window);
