#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
const Marked = require('marked');
const fetch = require('node-fetch');
const colors = require('colors');

const mdLinks = function markdownLinkExtractor(markdown) {
  // Función necesaria para extraer los links usando marked
  // Recibe texto en markdown y retorna sus links en un arreglo
  const links = [];
  const renderer = new Marked.Renderer();
  // Taken from https://github.com/markedjs/marked/issues/1279
  const linkWithImageSizeSupport = /^!?\[((?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?)\]\(\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?(?:\s+=(?:[\w%]+)?x(?:[\w%]+)?)?)(?:\s+("(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)))?\s*\)/;

  Marked.InlineLexer.rules.normal.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.gfm.link = linkWithImageSizeSupport;
  Marked.InlineLexer.rules.breaks.link = linkWithImageSizeSupport;

  renderer.link = (href, title, text) => {
    links.push({
      href: href,
      text: text,
      title: title,
    });
  };

  renderer.image = (href, title, text) => {
    // Remove image size at the end, e.g. ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      title: title,
    });
  };
  Marked(markdown, {renderer: renderer});
  return links;
};

let currentDirectory = process.cwd(); /* Ruta actual del directorio */
console.log(`directorio actual: ${process.cwd()}`);
let cwdBuffer = Buffer.from(currentDirectory);
const [,, ...userArgs] = process.argv; /*  */
let validate = userArgs[0];

fs.readdir(cwdBuffer, (err, files) => { /* Lee los contenidos del directorio */
  if (err) {
    console.log(err.message);
  } else {
    files.forEach(file => {
      if (path.extname(file) === '.md') { /* selecciona los archivos con extension .md */
        fs.readFile(file, 'utf8', function(err, data) { /* lee los archivos con extension .md */
          if (err) { /* error al no lograr encontrar archivos */
            console.log(err);
          } else {
            mdLinks(data).forEach(element => {/* recorriendo data */
              if (validate === '--validate') {/* validando --validate */
                fetch(`${element.href}`).then((response) => {
                  /* mostrando nombre de archivo, texto, link y status con --validate*/
                  console.log(`Archivo: ${file.blue} Texto: ${element.text.green} Link: ${response.url.yellow} Status: ${response.status} ${response.statusText.cyan}`);
                }).catch((err) => {
                  /* mostrando nombre de archivo, texto, link y status de enlaces rotos con --validate*/
                  console.error(`Enlace roto --> Archivo: ${file.blue} Texto: ${element.text.green} Link: ${element.href.yellow}` + err);
                });
              } else {
                fetch(`${element.href}`).then((response) => {
                  /* mostrando nombre de archivo, texto, link y status de enlaces con md-links*/
                  console.log(`Archivo: ${file.blue} Texto: ${element.text.green} Link: ${element.href.yellow}`);
                }).catch((err) => {
                  /* mostrando nombre de archivo, texto, link y status de enlaces rotos con md-links*/
                  console.error(`Enlace roto --> Archivo: ${file.blue} Texto: ${element.text.green} Link: ${element.href.yellow}` + err);
                });
              }
            });
          }
        });
      }
    });
  }
});

module.exports = mdLinks;

