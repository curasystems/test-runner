var defaults = require('lodash.defaults');

var util = require('util');

var growl = require('growl');
var glob = require('glob');
var chai = require('chai')

var Mocha = require('mocha');

var DEFAULT_OPTIONS = {
    files: 'test/*.coffee',
    coffee: true,
    globalChai: true,
    globalExpect: true,
    globalShould: true,
    useColors: true,
    notifyGrowl: true,
    delayExitToAllowForStreamFlushes: true
  };

module.exports = function(options){

  if(!options)
    options = {};

  var argv = require('optimist')
    .default('reporter', 'spec')
    .argv;

  defaults(options, DEFAULT_OPTIONS );

  if(options.coffee)
    require('coffee-script/register');

  if(options.delayExitToAllowForStreamFlushes)
    overrideProcessExitToDelayExitByMs(1500);

  if(options.globalExpect)
    global.expect = chai.expect;

  if(options.globalChai)
    global.chai = chai;

  if(options.globalShould)
    chai.should();

  var reporterResults = {};
  var Reporter = LookupMochaReport(argv.reporter);

  runTests(options.files, PassThroughReporter, function(firstError, result){
    if(firstError)
      return notifyDeveloper(firstError,result) 
  });

  function runTests(files, reporter, cb){

    var mocha = new Mocha({
      ui: 'bdd',
      reporter: reporter
    });

    addFilesToMocha(files, mocha, function(){
      mocha.useColors = options.useColors;
      mocha.run(function(failures){
        var firstError = reporterResults.firstError;
        var result = reporterResults.result;
        cb(firstError,result);
      });
    });
  }

  function notifyDeveloper(err, result){
    if(options.notifyGrowl)
      showGrowlMessage(err, result);
  }

  function addFilesToMocha(files, mocha, cb){
    var mochaOptions  = {};

    glob(files, mochaOptions, function(err, files){
    
      files.forEach( function(file){
        mocha.addFile(file);
      });

      cb(err);
    });  
  }


  function showGrowlMessage(firstError, result) {
     
      var message = firstError;

      var growlOptions = {
        title : result
      };

      growl( message, growlOptions );
  }

  function PassThroughReporter(runner) {

    new Reporter(runner);

    var passes = 0;
    var failures = 0;
    var total = 0;

    reporterResults.firstError = null;
    reporterResults.result = null;
    
    runner.on('pass', function(test){
      passes++;
    });

    runner.on('fail', function(test, err){
      failures++;
      if( !reporterResults.firstError )
        reporterResults.firstError = test.fullTitle() + ": " + err.message;
    });

    runner.on('end', function(){
      reporterResults.result = util.format('Passed %d/%d', passes, passes + failures);    
    });
  }

  function LookupMochaReport(name){

    for( var propertyName in Mocha.reporters ){
      if( propertyName.toLowerCase() === name ){
        return Mocha.reporters[propertyName];
      }
    }
    
    console.error("ERROR: Could not find reporter " + name );
    return null;
  }


  function overrideProcessExitToDelayExitByMs(delayInMs){
    var exit = process.exit;

    process.exit = function(code){
      setTimeout(function(){
        exit(code);
      },delayInMs);
    };
  }
};