cura-test-runner
================

Simple test-runner to include as dev-dependency. Write a test.js and require this module to automatically run coffee tests with mocha.

## Install:

    npm install cura-test-runner --save-dev

### test.js

    require('cura-test-runner')

### Add this into package.json for convenience:

    "scripts": {
      "test": "node test.js",
      "dev": "nodemon -e coffee,js test.js"
    },

Note: We mapped **npm run-script** to **rs** so we can write **rs dev**
and have continuous testing of our code on save.

For that you must have nodemon installed globally with:

    npm install -g nodemon
