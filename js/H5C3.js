function FixSubgrids(w, d) {
  var element = d.querySelector('main[aria-label="four-column-grid"]');
  var elementStyle = element.style;
  var computedStyle = w.getComputedStyle(element, null);
  var outputStyle = '';

  if (element.contains(element) !== true) {
    if (elementStyle.display === 'subgrid') {
      computedStyle.display = 'grid';
      computedStyle.cssText = "grid-template-columns: repeat(var(--columns), calc(" + element.offsetWidth + " - (var(--column-spacing) * var(columns)) / var(--columns)) [subgrid-col-start]))";
      computedStyle.cssText = "grid-template-rows: auto; grid-auto-flow: row; grid-row-gap: var(--row-spacing);"
    }
  }
}(window, document);

(function (w, d) {
  FixSubgrids(w, d);
})(window, document);
