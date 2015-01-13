/*
    expansive.es - Configuration for exp-css

    Transform by prefixing and minifying. Uses autoprefixer and less|recess.
 */
Expansive.load({
    transforms: [{
        name:   'prefix-css',
        input:  'css',
        output: 'css',
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
        name:   'minify-css',
        input:  'css',
        output: 'css',
        enable: false,
        script: `
            function transform(contents, meta, service) {
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
                return contents
            }
        `
    }]
})
