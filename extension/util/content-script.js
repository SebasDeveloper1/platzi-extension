function injectScript(file, node) {
  let th = document.getElementsByTagName(node)[0];
  let s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", file);
  s.defer = true;
  th.appendChild(s);
}

function injectCss(file, node) {
  let th = document.getElementsByTagName(node)[0];
  let s = document.createElement("link");
  s.setAttribute("rel", "stylesheet");
  s.setAttribute("href", file);
  th.appendChild(s);
}
