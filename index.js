#!/usr/bin/env node

let fs = require('fs');
let path = require('path');
const Marked = require('marked');
const fetch = require('node-fetch');
const stringSearcher = require('string-search');
// const mdLinks = require('./mdlinks.js');
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

  renderer.link = (href, title, text, line) => {
    links.push({
      href: href,
      text: text,
      title: title,
      line: line,
    });
  };

  renderer.image = (href, title, text, line) => {
    // Remove image size at the end, e.g. ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      title: title,
      line: line,
    });
  };
  Marked(markdown, {renderer: renderer});
  return links;
};


//  Ruta actual del directorio
let currentDirectory = process.cwd();
console.log(`directorio actual: ${process.cwd()}`);
let cwdToString = Buffer.from(currentDirectory);

//  Lee los contenidos del directorio
fs.readdir(cwdToString, (err, files) => {
  if (err) {
    console.log(err.message);
  } else {
    files.forEach(file => {
      // console.log(file);
      // Selecciona los archivos con extensión .md
      if (path.extname(file) === '.md') { 
        // console.log(file);
        // lee los archivos con extension .md
        fs.readFile(file, 'utf8', function(err, data) {
          if (err) {
            console.log(err);
            // rechaza la promesa
            return reject(err);
          } else {
            // retorna promesa con array de objeto
            // console.log(mdLinks(data));
            mdLinks(data).forEach(element => {
              fetch(`${element.href}`, { validate: true }).then((response)=>{
                // objeto con texto, links y status
                let arrData = {
                  link: response.url.blue,
                  text: element.text.green,
                  title: file.cyan,
                  status: response.status,
                  statusText: response.statusText.red,
                  lineLinks: element.line
                };
                console.log(`Archivo: ${arrData.title} Texto: ${arrData.text} Link: ${arrData.link} Status: ${arrData.status} ${arrData.statusText}`);
                // console.log(`${arrData.file} Link: ${arrData.link} Texto: ${arrData.text} Titulo: ${arrData.title} Status: ${arrData.status} ${arrData.statusText} Linea del link: ${arrData.lineLinks} `);
              });
            });
          }
        });
      }
    });
  }
});

module.exports = mdLinks;

