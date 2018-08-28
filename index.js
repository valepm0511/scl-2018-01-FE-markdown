#!/usr/bin/env node


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
      // title: title,
    });
  };

  renderer.image = (href, title, text) => {
    // Remove image size at the end, e.g. ' =20%x50'
    href = href.replace(/ =\d*%?x\d*%?$/, '');
    links.push({
      href: href,
      text: text,
      // title: title,
    });
  };
  Marked(markdown, {renderer: renderer});

  return links;
};


let fs = require('fs');
let path = require('path');
// const mdLinks = require('./mdlinks.js');
const Marked = require('marked');
const fetch = require('node-fetch');

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
              //rechaza la promesa
              return reject(err);
            } 
            else {
              // retorna promesa con array de objeto
              // console.log(mdLinks(data));
              mdLinks(data).forEach(element => {
                fetch(`${element.href}`, { validate: true }).then((response)=>{
                  // retorna la lista de url con status
                  // console.log(response.url, 
                  //   response.status, 
                  //   response.statusText);
                });
              });
            }
          });
         }
       });
  }
});


module.exports = mdLinks;
