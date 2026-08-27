# Quick Start Guide

Get up and running with LogBook in just a few steps.

## Installation

To start running this project locally, execute the following commands in your terminal:

```bash
# Clone this repository
git clone https://github.com/your-username/logbook.git

# Navigate into the project folder
cd logbook

# Install the dependencies
npm install

# Run the development server
npm run dev
```

## Exploring Content

Use the sidebar navigation to jump between pages. LogBook parses raw Markdown files on the fly and renders them into clean, readable document pages.

## Customizing Sidebar

All navigation topics are defined in the configuration file:
- `public/content/Sidebar.json`

To add a new page, simply define it in `Sidebar.json` and create the corresponding markdown file under `public/content/docs/`.
