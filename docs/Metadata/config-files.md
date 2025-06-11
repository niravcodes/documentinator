# Configuration and Metadata files

For simplicity, all config and metadata is optional.

## Sitewide Configuration

The sitewide configuration can be added under `config.yml` file at the root of the `./docs`.

```yaml
siteTitle: Project Documentation
```

| Property  | Default         | Description                                               |
| --------- | --------------- | --------------------------------------------------------- |
| siteTitle | "Documentation" | The title displayed at the top of your documentation site |

## Frontmatter

Frontmatter can be added at the top of any markdown file to configure page-specific settings.

```yaml
---
title: Documentinator
sidebarPosition: 1
---
```

| Property        | Default   | Description                                                                      |
| --------------- | --------- | -------------------------------------------------------------------------------- |
| title           | File name | The title of the page displayed in the navigation and browser tab                |
| sidebarPosition | -         | The position of this page in the sidebar navigation (lower numbers appear first) |

## Category Metadata

Under any category, you can create a `category.yml` file to configure category-specific settings.

```yaml
label: "Category Name"
position: 3
```

| Property | Default        | Description                                                               |
| -------- | -------------- | ------------------------------------------------------------------------- |
| label    | Directory name | The display name for the category in the sidebar                          |
| position | -              | The position of this category in the sidebar (lower numbers appear first) |

## Example Folder Structure

```
docs/
├── config.yml                 # Sitewide configuration
├── getting-started/
│   ├── category.yml          # Category metadata
│   ├── installation.md       # Page with frontmatter
│   └── configuration.md      # Page with frontmatter
├── api/
│   ├── category.yml
│   └── endpoints.md
└── tutorials/
    ├── category.yml
    ├── basic-usage.md
    └── advanced-features.md
```
