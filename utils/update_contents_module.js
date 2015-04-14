#!/usr/bin/env node

request = require('request');
fs = require('fs');
path = require('path');

var TEMPLATE =
"app.value('contents',\n" +
"  :contents\n" +
");";

var url = 'https://api.github.com/repos/MTEySS/concursos/git/trees/gh-pages?recursive=1';

var target = '../src/custom/contentsModule.js';

var options = {
  url: url,
  headers: {
    'User-Agent': 'request'
  }
};

var targetFile = path.join(__dirname, target);

request(options, function (error, response, body) {
  if (error || response.statusCode != 200) {
    console.log(body) // Show the HTML for the Google homepage.
    process.exit(-1);
  }

  var data = JSON.parse(body);

  var tree = data.tree.map(function(file) {
    return {
      path: file.path,
      type: file.type,
      size: file.size
    };
  });

  var contents = TEMPLATE.replace(':contents', JSON.stringify(tree));
  // console.log(contents);

  var currentContents = fs.readFileSync(targetFile);

  if (currentContents == contents) {
    console.log('file ' + targetFile + ' was already updated');
  } else {
    fs.writeFileSync(targetFile, contents);
    console.log('file ' + targetFile + ' successfully updated');
    // commit();
  }

});

var commit = function() {
  var exec = require('child_process').exec;
  var cmd = 'git add ' + targetFile;

  console.log('running ' + cmd);
  exec(cmd, function (error, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);

    if (error) {
      console.log('error adding updated file to git (cmd: ' + cmd + ')');
      process.exit(-1);
    }

    if (!error) {
      var d = new Date();
      var comment = 'updated contentsModule.js - ' +
        d.getFullYear() + '-' + (parseInt(d.getMonth()) + 1).toString() + '-' + d.getUTCDate() + ' ' +
        d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
      var cmd = 'git commit -m "' + comment + '"';
      console.log('running ' + cmd);
      exec(cmd, function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);

        if (error) {
          console.log('error committing updated file to git (cmd: ' + cmd + ')');
          process.exit(-1);
        }
      });
    }

  });

}