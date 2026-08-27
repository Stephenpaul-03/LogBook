# Architecture Guide

Cascade is designed to separate documentation structures from visual interactive playgrounds.

## Parser Pipeline

1. **Markdown Intake:** The parser extracts frontmatter configurations.
2. **Interactive Elements:** Code snippets are highlit via Prism.js, and custom syntax outputs elements like quizzes.
3. **HTML Rendering:** Clean standard DOM nodes are injected with Tailwind styles.
