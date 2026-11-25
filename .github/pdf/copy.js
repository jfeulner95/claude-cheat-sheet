// Copy-to-clipboard for code blocks, inline code and links (HTML version only).
(function () {
  "use strict";

  function selectText(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function flash(el, label) {
    el.setAttribute("data-copied", label);
    clearTimeout(el._copyTimer);
    el._copyTimer = setTimeout(function () { el.removeAttribute("data-copied"); }, 1200);
  }

  // Legacy copy through a temporary textarea; works without the Clipboard API (e.g. on http).
  function execCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  // Copies `text`. If the Clipboard API is missing or refuses, tries the legacy copy;
  // if that fails too, selects `selectEl` when it shows exactly `text`, else offers `text` in a prompt.
  function copy(text, feedbackEl, selectEl) {
    var fallback = function () {
      if (execCopy(text)) { flash(feedbackEl, "Kopiert"); return; }
      if (selectEl.textContent.trim() === text.trim()) {
        selectText(selectEl);
        flash(feedbackEl, "Markiert – Strg/⌘+C");
      } else {
        window.prompt("Zum Kopieren Strg/⌘+C drücken:", text);
      }
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { flash(feedbackEl, "Kopiert"); }, fallback);
    } else {
      fallback();
    }
  }

  function onActivate(el, handler) {
    el.addEventListener("click", handler);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handler(e); }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Code blocks: visible button
    document.querySelectorAll("pre").forEach(function (pre) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "Kopieren";
      btn.addEventListener("click", function () {
        var code = pre.querySelector("code") || pre;
        copy(code.innerText.replace(/\n$/, ""), btn, code);
      });
      pre.appendChild(btn);
    });

    // Inline code: click or Enter copies
    document.querySelectorAll(":not(pre) > code").forEach(function (code) {
      code.setAttribute("role", "button");
      code.setAttribute("tabindex", "0");
      code.setAttribute("title", "Klicken zum Kopieren");
      onActivate(code, function () { copy(code.textContent, code, code); });
    });

    // External links: small copy icon next to the link
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-link";
      btn.textContent = "⧉";
      btn.setAttribute("aria-label", "Link kopieren");
      btn.setAttribute("title", "Link kopieren");
      btn.addEventListener("click", function () { copy(a.href, btn, a); });
      a.insertAdjacentElement("afterend", btn);
    });
  });
})();
