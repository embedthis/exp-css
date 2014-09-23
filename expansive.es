/*
    exp.json - Configuration for exp-css

    Transform by prefixing and minifying. Uses autoprefixer and less|recess.
 */
Expansive.load({
    expansive: {
        transforms: [{
            name:   'prefix-css',
            from:   'css',
            to:     'css',
            script: `
                function transform(contents, meta, service) {
                    let autoprefixer = Cmd.locate('autoprefixer', 
                        [ searchPak('exp-autoprefixer').join('node_modules/autoprefixer/bin') ])
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
            from:   'css',
            to:     'css',
            script: `
                function transform(contents, meta, service) {
                    let less = Cmd.locate('lessc', [ searchPak('exp-lessc').join('node_modules/less/bin') ])
                    if (less) {
                        let results = runFile(less + ' --clean-css - ', contents, meta)
                        contents = results
                    } else {
                        let recess = Cmd.locate('recess', [ searchPak('exp-recess').join('node_modules/recess/bin') ])
                        if (recess) {
                            let results = runFile(recess + ' -compile -compress', contents, meta)
                            if (results == '') {
                                /* Failed, run again to get diagnostics - Ugh! */
                                results = runFile(recess, contents, meta)
                                throw 'Failed to parse less file with recess ' + meta.file + '\n' + results + '\n'
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
    }
})
