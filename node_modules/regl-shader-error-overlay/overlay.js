//Monkeypatch console, adapted from sentry/raven-js.
var wrapMethod = function(console, level, callback) {
  var originalConsoleLevel = console[level];
  var originalConsole = console;

  if (!(level in console)) {
    return;
  }

  var sentryLevel = level === "warn" ? "warning" : level;

  console[level] = function() {
    var args = [].slice.call(arguments);

    var msg = "" + args.join(" ");
    var data = {
      level: sentryLevel,
      logger: "console",
      extra: { arguments: args }
    };

    if (level === "assert") {
      if (args[0] === false) {
        msg =
          "Assertion failed: " + (args.slice(1).join(" ") || "console.assert");
        data.extra.arguments = args.slice(1);
        callback && callback(msg, data);
      }
    } else {
      callback && callback(msg, data);
    }

    if (originalConsoleLevel) {
      Function.prototype.apply.call(
        originalConsoleLevel,
        originalConsole,
        args
      );
    }
  };
};

function setupOverlay() {
  wrapMethod(console, "log", (msg, data) => {
    if (!(msg.includes("uniform") && msg.includes("precision"))) {
      //not sure what do do with this predicate right now
      return;
    }
    let overlay = document.createElement("div");
    let textChunks = data.extra.arguments[0].split("%c");
    let chunkStyles = data.extra.arguments.slice(1);
    textChunks.map((s, i) => {
      let node = document.createElement("span");
      node.textContent = s;
      node.style = chunkStyles[i - 1];
      overlay.appendChild(node);
    });
    overlay.style =
      " display: inline-block; unicode-bidi: embed; font-family: monospace; white-space: pre-wrap; width:100%;";
    document.body.appendChild(overlay);
  });
}
module.exports = { setupOverlay };
