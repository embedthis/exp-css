exp-css
===

Expansive plugin for CSS files.

Provides the 'minify-css' and 'prefix-css' services.

### To install:

    pak install exp-css

### To configure in expansive.json:

* minify-css.enable -- Set to true to minify CSS files using lessc.
* prefix-css.enable -- Set to true to enable running autoprefixer on CSS files.


```
{
    services: {
        'minify-css': {
            enable: true
        }
        'prefix-css': {
            enable: true
        }
    }
}
```

### Get Pak from

[https://embedthis.com/pak/](https://embedthis.com/pak/download.html)
