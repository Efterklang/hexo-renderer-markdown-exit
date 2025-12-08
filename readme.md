# Hexo Renderer Markdown Exit

## Example Configuration

```yml
markdown_exit:
  render_options:
    html: true
    xhtmlOut: false
    langPrefix: "language-"
    breaks: true
    linkify: true
    typographer: true
    quotes: "“”‘’"
  plugins:
    - markdown-it-obsidian-callouts
    - name: markdown-it-inline-code
      options:
        themes:
          light: catppuccin-latte
          dark: catppuccin-mocha
          nord: nord
          tokyo: tokyo-night
  disableNunjucks: false
```

## Development

```shell
# install dependencies
bun i
# build the project
just build
# after modifying the code, run lint
just check
```

## Know Issues

- [ ] `abbr` plugin not working
- [ ] hexo custom tags not working
