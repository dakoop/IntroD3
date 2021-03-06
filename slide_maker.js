(function() {
  "use strict"

  var slide = {};
  window.slide = slide;

  function fn_to_string(fn) {
    var lines = fn.toString()
      .replace(/^function\s*\([^)]*\)\s*{\s*\n/, '')
      .replace(/\s*}\s*$/, '')
      .split('\n');

    // remove common pre-space
    var minSpace = d3.min(lines.map(function(line) {
      return line ? line.match(/^\s*/)[0].length : Infinity;
    }));
    if (minSpace && isFinite(minSpace)) {
      lines = lines.map(function(line) { return line.substr(minSpace); })
    }

    return lines.join('\n');
  }

  slide.code = function(title, init, code) {
    var out, codeText;

    function myInit() {
      out.selectAll('*').remove();
      init(out.node());
    }

    var section = d3.select('body')
      .append('section')
      .data([myInit])
      .attr('class', "code_slide")

    section.append('h1')
      .text(title)

    var codes = section.append('div')
      .attr('class', 'codes')

    function myConsoleLog() {
      var str = Array.prototype.slice.call(arguments).join(' ') + '\n';
      var pre = out.select('pre.log');
      if (pre.empty()) {
        out.append('pre')
          .attr('class', 'log')
          .text(str)
      } else {
        pre.text(pre.text() + str);
      }
    }

    function run() {
      var code = codeText.property('value');
      code = '(function(console) { \n' + code + '\n})({ log: myConsoleLog })';
      out.select('div.error').remove();
      out.select('pre.log').remove();
      try {
        eval(code);
      } catch(err) {
        out.append('div')
          .attr('class', 'error')
          .text('Error: ' + err.message)
      }
    }

    codeText = codes.append('textarea')
      .attr('class', 'code')
      .property('value', fn_to_string(code))
      .on('keydown', function(event) {
          // Run if command + enter
          if (d3.keyCode === 13 && d3.metaKey) run();
          d3.event.stopPropagation();
        })

    var buttonBar = codes.append('div')
      .attr('class', 'button_bar')

    buttonBar.append('div')
      .attr('class', 'run btn')
      .text('Run')
      .on('click', run)

    buttonBar.append('div')
      .attr('class', 'reset btn')
      .text('Reset')
      .on('click', myInit)

    out = section.append('div')
      .attr('class', "out")
  }

  slide.code_title = function(title) {
    d3.select('body')
      .append('section')
      .attr('class', "code_title")
        .append('h1')
        .text(title);
  }

  slide.title = function(title) {
    d3.select('body')
      .append('section')
      .attr('class', "title")
        .append('h1')
        .text(title);
  }
})();


