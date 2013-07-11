require('coffee-script-mapped');

var util = require('util')
var growl = require('growl');
var glob = require('glob');

var Mocha = require('mocha');

var argv = require('optimist')
  .default('reporter', 'spec')
  .argv;
  
require('chai').should();

var reporterResults = {};
var Reporter = require('./reporters/'+argv.reporter);

runTests('test/*.coffee', PassThroughReporter, function(firstError, result){
  if(firstError)
    return notifyDeveloper(firstError,result) 
});

function runTests(files, reporter, cb){

  var mocha = new Mocha({
    ui: 'bdd',
    reporter: reporter
  });

  addFilesToMocha(files, mocha, function(){
    mocha.run(function(failures){
      var firstError = reporterResults.firstError;
      var result = reporterResults.result;
      cb(firstError,result);
    });
  });
}

function notifyDeveloper(err, result){
  showGrowlMessage(err, result);
}

function addFilesToMocha(files, mocha, cb){
  var options  = {};

  glob(files, options, function(err, files){
  
    files.forEach( function(file){
      mocha.addFile(file);
    });

    cb(err);
  });  
}


function showGrowlMessage(firstError, result) {
   
    var message = firstError;
    var options = {
      title : result
    };

    growl( message, options );
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