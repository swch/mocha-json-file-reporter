/**
 * Expose `JSON`.
 */
var util = require('util'),
    fs   = require('fs')


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

    process.stdout.write(JSON.stringify(obj, null, 2));

      try {
          util.print("Generating report.json file")
          var out  = fs.openSync("report.json", "w");
          fs.writeSync(out, JSON.stringify(result, null, 2 ));
          fs.close(out);
          util.print("Generating report.json file complete")
      } catch (error) {
          util.print("Error: Unable to write to file report.json\n");
          return;
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