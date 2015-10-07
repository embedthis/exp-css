exp-css
===

Expansive plugin for CSS files.

## Overview

The exp-css plugin provides build tooling for stylesheets. It provides the **prefix-css** service to automatically insert browser specific CSS prefixes, the **render-css** service to manage the generation HTML for stylesheets, and the **minify-js** service to minify script files for release distributions.

## Installation

    pak install exp-css

## Services

Provides the following services

* css
* prefix-css
* minify-css
* render-css

## css

The **css** service provides configuration control for the other css services.

### Configuration

* dotmin &mdash; Use '.min.css' as the output file extension after minification. Otherwise will be
    '.css'.  Default to true.
* enable &mdash; Enable the service. Defaults to true.
* force &mdash; Force minification even if a minified source file exists.
* minify &mdash; Enable minifying of Javascript files. Default to false.
* usemap &mdash; Use minified stylesheet if corresponding source maps is present. Defaults to true.
* usemin &mdash; Use minified stylesheet if present. Defaults to null. Set explicitly to false
    to disable the use of minified resources.

## prefix-css

The prefix-css service processes CSS files to automatically add browser specific prefixes to CSS rules. It requires the `autoprefixer` utility.

## render-css
The render-css service smartly selects supplied stylesheets. By default, it selects minified stylesheets if a corresponding source map file with a 'css.map' extension is present. Otherwise, non-minified stylesheets files with a plain 'css' extension  will be selected.

The renderStyles API will generate the HTML for the page to include the specified stylesheets. The styles are taken from the current 'styles' collection for the page. Use 'addItems' and 'removeItems' to modify the styles collection.

```
    <@ renderStyles() @>
```

## minify-css

The minify-css service optimizes stylesheets by minifying to remove white-space, managle names and otherwise compress the stylesheets. By default, the stylesheets use a '.css' extension, but will use a '.min.css' extension if the 'dotmin' option is enabled.

## Example

The `debug` collection will be selected if the package.json `pak.mode` is set to debug. Similarly for the `release` collection.

```
debug: {
    services: {
        "css": {
            usemap: true
        }
    }
}
release: {
    services: {
        "css": {
            minify: true
        }
    }
}
```

## Get Pak

[https://embedthis.com/pak/](https://embedthis.com/pak/)
