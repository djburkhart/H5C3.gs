# H5C3.gs

H5C3.gs (HTML5 CSS Grid System) version 2 is a responsive grid for current browsers. Columns come from CSS grid, not from a pixel formula, and they change with the width of the grid itself.

## Quick start

```html
<link rel="stylesheet" href="css/H5C3.gs.css">

<main class="grid" data-cols="4" data-min="12rem">
  <header class="span-all">…</header>
  <article>…</article>
  <article class="span-2">…</article>
  <aside>…</aside>
</main>

<script src="js/H5C3.js"></script>
```

`css/H5C3.gs.css` does the layout. `js/H5C3.js` measures the tracks that were actually created, clamps spans to that count, and can apply area templates. The page still lays out if the script does not run.

## How columns are chosen

A `.grid` uses `repeat(auto-fit, minmax(...))`.

- **No `data-cols`.** As many columns as fit, each at least `--min` (default `16rem`).
- **`data-cols="n"`.** At most *n* columns. The grid drops to fewer columns when an even share of the row would be narrower than `--min`.
- **`data-layout="fixed"`.** Exactly `--cols` tracks. They shrink instead of wrapping.

`data-cols` from 1 through 12 is built in. Browsers that support typed `attr()` accept any positive number. The script also copies `data-cols` onto `--cols`.

Set the minimum track with a preset or a length:

| `data-min` | Minimum track |
| --- | --- |
| `xs` | 8rem |
| `sm` | 12rem |
| `md` | 16rem |
| `lg` | 22rem |
| `xl` | 30rem |
| `14rem`, `200px`, … | that length |

Gap presets are `none`, `xs`, `sm`, `md`, `lg`, and `xl`. A length such as `data-gap="1.5rem"` also works. Any of these can be set directly with `--cols`, `--min`, and `--gap`.

## Spans, offsets, and subgrid

| Class | Effect |
| --- | --- |
| `.span-2` … `.span-12` | Span that many columns, but never more than the grid currently has |
| `.span-all` | Full width (`1 / -1`) |
| `.offset-1` … `.offset-11` | Start after that many columns, clamped so the item stays inside the grid |
| `.row-span-2`, `.row-span-3` | Span rows |
| `.subgrid` | Occupy the parent’s columns and line its children up with those tracks |

```html
<div class="grid" data-cols="4">
  <article class="span-2">Half of a 4-column row</article>
  <aside class="span-2">Other half</aside>
  <div class="subgrid">
    <p>Track 1</p>
    <p>Track 2</p>
    <p>Track 3</p>
    <p>Track 4</p>
  </div>
</div>
```

On a narrow grid those `.span-2` items become full width instead of forcing extra columns.

## Alignment and flow

- `data-align`: `start`, `center`, `end`, `stretch`
- `data-justify`: `start`, `center`, `end`, `stretch`
- `data-flow`: `column`, `dense`, `column-dense`
- `data-rows`: `2` through `6` explicit rows
- `.self-start`, `.self-center`, `.self-end`, `.self-stretch`
- `.order-first`, `.order-last`

## Area templates

Templates are optional and follow the measured column count. `data-template` is the one-column layout. `data-template-3` is used only when the grid currently has three columns. Each row must list that many areas, separated with `|`.

```html
<div class="grid" id="split" data-cols="3"
     data-template="story | notes"
     data-template-3="story story notes">
  <article data-area="story">…</article>
  <aside data-area="notes">…</aside>
</div>
```

At two columns the template is removed and the two regions share the row. At one column they stack.

## JavaScript

The global is `H5C3` (version 2.0.0).

| Method | What it does |
| --- | --- |
| `H5C3.mount(root)` | Watch grids under `root` |
| `H5C3.refresh(root)` | Measure again |
| `H5C3.columns(el)` | Current column count |
| `H5C3.setColumns(el, n)` | Set `data-cols` and `--cols` |
| `H5C3.setMin(el, value)` | Preset or length |
| `H5C3.setGap(el, value)` | Preset or length |
| `H5C3.setSpan(el, n \| "all")` | Replace the span class |
| `H5C3.setOffset(el, n)` | Replace the offset class. `0` clears it |
| `H5C3.areas(el, template)` | Apply a template string or an array of rows |
| `H5C3.debug(true)` | Outline cells and label the computed `grid-column` |

After a measure, each grid has `data-current-cols` and `--current-cols`. An element with `data-reflect="some-id"` shows that grid’s column count. Add `?debug` to the URL, or the class `debug` on `<html>`, to turn outlines on. Buttons with `data-debug-toggle` flip the same mode.

Grids added to the page later are picked up automatically.

## Examples

- [2 columns](2x2.html)
- [3 columns](3x3.html)
- [4 columns](4x4.html)

## Browser support

The layout uses CSS grid, custom properties, `minmax` / `min` / `max`, and container queries. Subgrid lines nested cells up with their parent; without subgrid, a nested grid falls back to its own fluid tracks. Typed `attr()` is used when the browser has it, with explicit `data-cols` rules as the fallback. The script uses `ResizeObserver` and, if that is missing, the window `resize` event.

## Author

* **Daniel Burkhart** — original H5C3.gs — [Personal website](http://www.danielburkhart.com/)

## License

Apache 2.0. See [LICENSE](LICENSE).
