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

## Usage

Documentinator provides two main commands:

### Serve Documentation

```bash
npx documentinator serve [docsDir]
```

This command starts a local server to preview your documentation. By default, it looks for markdown files in the `./docs` directory.

### Build Documentation

```bash
npx documentinator build [docsDir]
```

This command builds your documentation into static files. Like the serve command, it defaults to using the `./docs` directory if no path is specified.

The built HTML goes to ./dist folder.

## Directory Structure

> **Note**
  Template is optional. A sensible template has already been included.

```
docs/
  ├── your-markdown-files.md
  └── template/
      └── custom-template.html
```

## Custom Templates

You can create custom templates for your documentation by adding HTML files in the `docs/template` directory.

The simplest template might look like this:

```html
{{{sidebar}}} {{{content}}}
```

A more detailed default template can be found in the `template` folder.
