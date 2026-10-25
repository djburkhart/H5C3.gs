/*
  FILE: site.js
  Toggles the H5C3.gs debug class on the project site.
*/
(function () {
  var toggle = document.querySelector("[data-debug-toggle]");
  var root = document.querySelector("[data-debug-root]");

  if (!toggle || !root) {
    return;
  }

  function setDebug(on) {
    root.classList.toggle("debug", on);
    toggle.setAttribute("aria-pressed", on ? "true" : "false");
    toggle.textContent = on ? "Hide debug styles" : "Show debug styles";
  }

  if (new URLSearchParams(window.location.search).has("debug")) {
    setDebug(true);
  }

  toggle.addEventListener("click", function () {
    setDebug(!root.classList.contains("debug"));
  });
})();
