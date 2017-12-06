/**
 * Expose `JSON`.
 */
let fs   = require('fs')

let mocha = require('mocha');
let Base = mocha.reporters.Base
    , cursor = Base.cursor
    , color = Base.color;

module.exports = JSONFileReporter;

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function JSONFileReporter(runner) {
  var self = this;
  Base.call(this, runner);

  var tests = []
    , failures = []
    , passes = [];

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var obj = {
        stats: self.stats
      , tests: tests.map(clean)
      , failures: failures.map(clean)
      , passes: passes.map(clean)
    };
    var jsonOutput = JSON.stringify(obj, null, 2);
      try {
          console.log("\nGenerating report.json file")
          var path = "./";
          if(process.env.REPORT_PATH){
              path = process.env.REPORT_PATH
          } else {
              path = "reports"
          }
          var out  = fs.openSync(path+"/report.json", "w");

          fs.writeSync(out, jsonOutput);
          fs.close(out);
          console.log("\nGenerating report.json file complete in "+path+"\n")
      } catch (error) {
          console.log("\nError: Unable to write to file report.json\n");
      }
  });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
  return {
      title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
  }
}
