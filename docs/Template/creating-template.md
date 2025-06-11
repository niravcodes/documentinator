# Creating Templates

If you need a custom template for your documentation, create a new `template` folder inside docs directory.
There, you can add index.html and any supporting files.

The following variables are available for use in your templates:

| Variable Name | Description                                                                                         | Example Usage                           |
| ------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `siteTitle`   | The main title of the site. Used in both the page title and header.                                 | `<title>{{siteTitle}}</title>`          |
| `title`       | The page-specific title (optional). When present, it's appended to the site title with a separator. | `{{#title}} - {{title}}{{/title}}`      |
| `baseURL`     | The base URL path where your documentation is hosted. Used to prefix all internal links and assets. | `<link href="{{{baseURL}}}/style.css">` |
| `sidebar`     | The sidebar content. Uses triple braces to allow HTML content.                                      | `{{{sidebar}}}`                         |
| `content`     | The main page content. Uses triple braces to allow HTML/markdown rendered content.                  | `{{{content}}}`                         |

## Usage Notes

- Variables wrapped in double braces (`{{variable}}`) will have HTML characters escaped
- Variables wrapped in triple braces (`{{{variable}}}`) will not have HTML escaped, allowing for HTML content to be rendered
- The `title` variable is optional and will only appear in the page title when present
- The `baseURL` should be used to prefix all internal links and assets to ensure they work correctly when the site is hosted in a subdirectory
