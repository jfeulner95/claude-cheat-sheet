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

  // Copies text; if the Clipboard API is missing or refuses, selects `selectEl` instead.
  function copy(text, feedbackEl, selectEl) {
    var fallback = function () {
      selectText(selectEl);
      flash(feedbackEl, "Markiert – Strg/⌘+C");
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
