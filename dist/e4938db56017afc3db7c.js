function ready(e){"loading"!=document.readyState?e():document.addEventListener("DOMContentLoaded",e)}require("pathseg"),ready((function(){require("./src/download"),require("./src/upload"),require("./src/nesting"),require("./src/toolbar"),require("./src/demo"),require("./src/faq");var e=document.getElementById("message");return e.onclick=function(e){this.className=""},document.createElementNS&&document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect?window.SvgNest?window.File&&window.FileReader?window.Worker?void 0:(e.innerHTML="Your browser does not have web worker support",void(e.className="error animated bounce")):(e.innerHTML="Your browser does not have file upload support",void(e.className="error animated bounce")):(e.innerHTML="Couldn't initialize SVGnest",void(e.className="error animated bounce")):(e.innerHTML="Your browser does not have SVG support",void(e.className="error animated bounce"))}));