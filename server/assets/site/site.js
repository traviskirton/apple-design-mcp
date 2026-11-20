// Apple Design MCP site: the copy-URL buttons. The URL follows the host the page is served from,
// so the page is right on apple-design-mcp.com and on the workers.dev backup alike.
(function () {
  'use strict';
  var url = location.protocol === 'https:' ? location.origin + '/mcp' : 'https://apple-design-mcp.com/mcp';
  document.querySelectorAll('[data-server-url]').forEach(function (el) { el.textContent = url; });
  document.querySelectorAll('[data-copy-url]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var done = function (text) {
        btn.textContent = text;
        setTimeout(function () { btn.textContent = label; }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { done('Copied'); }, function () { done(url); });
      else done(url);
    });
  });
})();
