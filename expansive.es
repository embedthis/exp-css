/*
    expansive.es - Configuration for exp-css

    Transform by prefixing and minifying. Uses autoprefixer and less|recess.
 */
Expansive.load({
    transforms: [{
        name:     'prefix-css',
        mappings: 'css',
        script: `
            function transform(contents, meta, service) {
                let autoprefixer = Cmd.locate('autoprefixer')
                if (autoprefixer) {
                    contents = run(autoprefixer, contents)
                } else {
                    trace('Warn', 'Cannot find autoprefixer')
                }
                return contents
            }
        `
    }, {
        name:     'minify-css',
        files:    null,
        mappings: {
            'css',
            'min.css'
        },
        usemin: true,

        minify: false,
        dotmin: true,

        script: `
            function init() {
                let directories = expansive.directories
                let service = expansive.services['minify-css']
                let collections = expansive.control.collections
                /*
                    Build list of stylesheets to render. Must be in pak dependency order.
                    Permit explicit stylesheet override list in pak package.json pak.render.css
                 */
                let files
                if (service.files) {
                    files = expansive.directories.top.files(service.files, {directories: false, relative: true})
                } else {
                    let list = expansive.directories.top.files(expansive.control.documents, 
                        {directories: false, relative: true})
                    list = list.filter(function(path) path.glob('**.css'))
                    files = []
                    /* Sort files by pak dependency order */
                    for each (pak in expansive.pakList) {
                        let path = directories.lib.join(pak)
                        let json = directories.paks.join(pak, 'package.json').readJSON()
                        let explicitRender = (json && json.pak && json.pak.render) ? json.pak.render.css : null
                        for each (file in list) {
                            if (file.startsWith(path)) {
                                if (!explicitRender) {
                                    files.push(file)
                                }
                            }
                        }
                        if (explicitRender) {
                            /* Expand first to permit ${TOP} which is absolute to override directories.lib */
                            for (let [key,value] in explicitRender) {
                                explicitRender[key] = value.expand(expansive.dirTokens, { fill: '.' })
                            }
                            let render = directories.lib.join(pak).files(explicitRender, {relative: true})
                            for each (path in render) {
                                files.push(directories.lib.join(pak, path).relative)
                            }
                        }
                    }
                }
                files = files.unique()

                let styles = []
                service.hash = {}
                let style = null
                for each (file in files) {
                    let ext = file.extension
                    if (file.endsWith('min.css')) {
                        if (service.usemin) {
                            service.hash[file.name] = true
                            style = file
                        } else {
                            service.hash[file.name] = 'not required because "usemin" is false.'
                        }
                    } else if (ext == 'css') {
                        let minified = file.replaceExt('min.css')
                        if (service.usemin && minified.exists) {
                            service.hash[file.name] = 'not required because ' + file.replaceExt('min.css') + ' exists.'
                        } else if (service.minify) {
                            service.hash[file.name] = { minify: true }
                            style = file
                        }
                    }
                    if (style) {
                        styles.push(style.trimStart(directories.lib + '/').trimStart(directories.contents + '/'))
                    }
                }
                collections.styles = styles + (collections.styles || [])
            }
            init()

            function transform(contents, meta, service) {
                let instructions = service.hash[meta.source]
                if (!instructions) {
                    return contents
                }
                if (instructions is String) {
                    vtrace('Info', meta.file + ' ' + instructions)
                    return null
                }
                if (instructions.minify) {
                    let less = Cmd.locate('lessc')
                    if (less) {
                        contents = run(less + ' --compress - ', contents, meta)
                    } else {
                        /*
                            Can also use recess if lessc is not installed
                         */
                        let recess = Cmd.locate('recess')
                        if (recess) {
                            let results = runFile(recess + ' -compile -compress', contents, meta)
                            if (results == '') {
                                /* Failed, run again to get diagnostics - Ugh! */
                                results = runFile(recess, contents, meta)
                                throw 'Failed to parse less file with recess ' + meta.source + '\n' + results + '\n'
                            }
                            contents = results
                        } else {
                            trace('Warn', 'Cannot find lessc or recess')
                        }
                    }
                    if (service.dotmin && !meta.document.contains('min.css')) {
                        meta.document = meta.document.trimExt().joinExt('min.css', true)
                    }
                }
                return contents
            }

            public function renderStyles() {
                let styles = (expansive.collections.styles || [])
                for each (style in styles) {
                    write('<link href="' + meta.top + style + '" rel="stylesheet" type="text/css" />\n    ')
                }
            }
        `
    }]
})
