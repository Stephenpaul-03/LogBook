# Frequently Asked Questions

Here are answers to the most common questions regarding LogBook.

## General Questions

### How does LogBook render Markdown?
LogBook uses the `marked` library to transform raw markdown files into structured HTML, which is then dynamically injected into the UI layout.

### Which projects are available?
The project selector currently provides the LogBook and Cascade documentation sets.
Each project has its own sidebar configuration under `public/content/`.

### Can I run this on mobile devices?
Yes! The desktop-only screen restriction has been removed. The layout adapts responsively to smartphones and tablet viewports.

### Where do I update documentation content?
Edit the relevant markdown file under `public/content/LogBook/` and keep its sidebar
entry in `public/content/LogBook_Sidebar.json` in sync.
