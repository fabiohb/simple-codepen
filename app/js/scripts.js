const codeField = document.getElementById("code");
var codeSource;
const preview = document.getElementById("preview");
const fileName = document.getElementById("fileName");

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function loadSource() {
  const url = getParameterByName("url");

  codeSource = document.createElement('code');
  codeSource.contentEditable = 'true';
  codeSource.spellcheck = false;
  codeSource.className = 'language-html';
  codeSource.textContent = '';
  codeField.textContent = '';
  codeField.appendChild(codeSource);

  if (url) {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        fileName.textContent = `[Arquivo: ${url}]`;
        codeSource.textContent = this.responseText;
        Prism.highlightElement(codeSource);
        render();
      }
    };
    http.open("GET", url);
    http.send();
  } else {
    codeSource.textContent = `
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Code</title>
  </head>
  <body>

  </body>
</html>
    `.trim();
    Prism.highlightElement(codeSource);
    render();
  }
}

function render() {
  let iframeComponent = preview.contentWindow.document;
  iframeComponent.open();
  iframeComponent.writeln(codeSource.textContent);
  iframeComponent.close();
}

window.onload = function () {
  document.addEventListener("keyup", render);
  loadSource();
}
