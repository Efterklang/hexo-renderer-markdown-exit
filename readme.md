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
    - name: markdown-it-obsidian-callouts
    - name: "markdown-exit-image"
      options:
        supported_domains: ["assets.example.com"]
        cache_path: ./thumbcache.json
  disableNunjucks: false
```

## Know Issues

- Markdown content in "hexo custom tags"[^1] is not processed correctly.

[^1]: https://hexo.io/docs/tag-plugins