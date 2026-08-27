# Product Guide

Welcome to the full guide on using LogBook. This application serves as a lightweight workspace for documentation rendering and project notes.

## Key Features

1. **Markdown-to-HTML Parser:** We use `marked` and custom styling to output gorgeous documents instantly.
2. **Flexible Themes:** Support for full light and dark modes with a simple toggle in the header.
3. **Command Palette:** Press `Cmd + K` (or `Ctrl + K`) to search and jump to any document in the workspace instantly.
4. **Responsive Layout:** The application adapts automatically to desktop, tablet, and mobile screens.

## Directory Structure

Here is how the project files are laid out:

```text
├── public/
│   └── content/
│       ├── LogBook_Sidebar.json  # LogBook navigation
│       ├── Cascade_Sidebar.json  # Cascade navigation
│       ├── LogBook/               # LogBook markdown content
│       └── Cascade/               # Cascade markdown content
├── src/
│   ├── components/
│   │   └── layout/            # Sidebar, Header, Breadcrumbs, etc.
│   └── main.tsx
```

## Adding Your Own Content

1. Create a markdown file under the relevant project directory, for example
   `public/content/LogBook/docs/my-new-page.md`.
2. Open the matching project sidebar JSON, for example
   `public/content/LogBook_Sidebar.json`.
3. Add a line to your preferred category under `topics`:
   ```json
   "My New Page": "/docs/my-new-page"
   ```
4. Refresh the application to view the new page automatically linked in that
   project's sidebar.
