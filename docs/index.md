---
title: Documentinator
sidebarPosition: 1
---

# Documentinator

_Behold, the Document-inator!_ A simple documentation builder.

Every project should have notes/docs folder in it's source code.
Helps with formulating thoughts, keeping TODOs,
recording decisions and, increasingly these days, aiding LLMs. That notes/docs folder
should be committed to git just like code.

Markdown is great for noting down programmer-thought, and it plays well with version control.
But it is not too pretty to look at all the time.

This simple tool will serve your folder of markdown notes as HTML in the browser.
It supports nested folders and files. You can include local images and local markdown.
Use mermaid diagrams too.

## Ideal usage

Ideally, you'll create a `docs` folder in your code repo. Maybe something like this:

```
your-project/
├── docs/           # create this folder here
├── frontend/
├── backend/
├── package.json
└── .env
```

The docs folder can have images, markdown and you can have folders.

```
docs/
├── index.md
├── logo.png
├── frontend/       # here some info files about frontend
├── deployment/     # deployment info and commands
└── ADRs/          # your architecture design decisions
```
