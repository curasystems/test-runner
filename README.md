cura-test-runner
================

Simple test-runner to include as dev-dependency. Write a test.js and require this module to automatically run coffee tests with mocha.

## Install

    npm install cura-test-runner --save-dev

### Create `test.js` file

`test.js`

    require('cura-test-runner/run');

## Running

Executing the test in (`test/*.coffee`) just requires running 

    node test.js 

or when test.js is configured as a test as seen below

    npm test

## Options

Sometimes it might make sense to override the defaults for the tests. In that case simply require the module and run the function manually with options.

`test.js`

    var runner = require('cura-test-runner');
    runner({ files: 'my-test-folder/*.test.js', coffee:false })

The default options are contained at the top of `index.js` for review.

## package.json Scripts

Add this into package.json for convenience:

    "scripts": {
      "test": "node test.js",
      "dev": "nodemon -e coffee,js test.js"
    },

Note: I mapped **npm run-script** to **rs** so we can write **rs dev**
and have continuous testing of our code on save.

For that to work you must have nodemon installed globally with:

    npm install -g nodemon
