# H5C3.gs

H5C3.gs stands for "HTML5 CSS3 Grid System." H5C3.gs is a modern web framework designed for modern web browsers.

## Getting Started

The following steps will get you ready to start using H5C3.gs on your next website or web application.

### Prerequisites

This is a list of all the tools you will need to begin using H5C3.gs

```
Adobe Photoshop
An IDE (ex. Brackets)
A modern web browser (ex. Google Chrome)
```

### How it works

Math formula used to generate column width:

```
([target-width]-([desired-column-spacing]*[desired-columns+1]))/[desired-columns]
```

HTML template (4x4 grid example):

```
<section role="region" aria-label="four-column-grid">
  <header role="banner">
    <h1>Example Heading</h1>
  </header>
  <nav role="navigation">
    <ul>
      <li>
        <a href="#">Link 1</a>
      </li>
      <li>
        <a href="#">Link 2</a>
      </li>
      <li>
        <a href="#">Link 3</a>
      </li>
    </ul>
  </nav>
  <main role="main" aria-label="two-column-subgrid">
    <section role="region" aria-label="page-info">
      <article>
        <h2>Some Article Heading</h2>
        <p>Article text.</p>
      </article>
    </section>
    <aside role="complementary">
      <h2>An Aside Heading</h2>
      <p>Some aside text.</p>
    </aside>
  </main>
  <footer role="contentinfo">
    <article>
      <p>&copy; Your Copyright Info. All rights reserved.</p>
    </article>
  </footer>
</section>
```

In the above example, the ```aria-label``` tag defines the grid type. This can be changed, for example, ```aria-label="two-column-grid"``` generates a two column grid.

Subgrids work the same way. For example, ```aria-label="two-column-subgrid"``` when used on a child element will generate a two column nested grid.

*See [4x4 Grid](4x4.html) for the above example.*

## Built With

* [EditorConfig](http://editorconfig.org/) - For consistent coding styles
* [Brackets](http://brackets.io/) - My prefered IDE

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Daniel Burkhart** - *Initial work* - [Personal Website](http://www.danielburkhart.com/)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* Photoshop Documents were produced by Michael Hulse's project [ps-web-starters](https://github.com/mhulse/ps-web-starters).
