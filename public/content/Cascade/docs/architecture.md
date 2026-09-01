# Architecture Guide

Cascade is designed to separate documentation structures from visual interactive playgrounds.

## Parser Pipeline

1. **Markdown Intake:** The parser extracts frontmatter configurations.
2. **Code Highlighting:** Fenced code snippets are highlighted via Prism.js.
3. **HTML Rendering:** Clean standard DOM nodes are injected with Tailwind styles.
