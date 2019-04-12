document.write(`HTML`);

//remove header and footer
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = `@page {
     margin: 0;
     size: auto;
 }`;
document.body.appendChild(css);

print();