function bundleLibrary(directory, fileType, exclude) {
    var bowerFile = require('./bower.json');
    var bowerPackages = bowerFile.dependencies;
    var mainFiles = [];
    var packagesOrder = [];
    var bowerDir = directory;
    exclude = typeof exclude !== 'undefined' ? exclude : [];

    function addPackage(name) {
        //package information and dependencies
        var info = require(bowerDir + '/' + name + '/bower.json');
        var dependencies = info.dependencies;

        //add dependencies by repeat the step
        if (!!dependencies) {
            underscore.each(dependencies, function (value, key) {
                if (exclude.indexOf(key) === -1) {
                    addPackage(key);
                }
            });
        }

        //and then add this package into the packagesOrder array if they do not exist yet
        if (packagesOrder.indexOf(name) === -1) {
            packagesOrder.push(name);
        }
    }

    //calculate the order of packages
    underscore.each(bowerPackages, function (value, key) {
        if (exclude.indexOf(key) === -1) {
            //add to packagesOrders if it's not excluded
            addPackage(key);
        }
    });

    //get the main files of packages base on the order
    underscore.each(packagesOrder, function (bowerPackage) {
        var info = require(bowerDir + '/' + bowerPackage + '/bower.json');
        var main = info.main;
        var mainFile;

        //get only .js files if mainfile is an array
        if (underscore.isArray(main)) {
            underscore.each(main, function (file) {
                if (underscoreStr.endsWith(file, '.' + fileType)) {
                    mainFile = file;
                }
            });
        }
        else {
            mainFile = main;
        }
        //make the full path
        mainFile = bowerDir + '/' + bowerPackage + '/' + mainFile;

        //only add the main file if it's a js file
        if (underscoreStr.endsWith(mainFile, '.' + fileType)) {
            mainFiles.push(mainFile);
        }
    });
    //return an array
    return mainFiles;
}
