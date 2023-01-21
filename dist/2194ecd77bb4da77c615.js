"use strict";function Matrix(){if(!(this instanceof Matrix))return new Matrix;this.queue=[],this.cache=null}("undefined"!=typeof window?window:self).Matrix=Matrix,Matrix.prototype.combine=function(t,e){return[t[0]*e[0]+t[2]*e[1],t[1]*e[0]+t[3]*e[1],t[0]*e[2]+t[2]*e[3],t[1]*e[2]+t[3]*e[3],t[0]*e[4]+t[2]*e[5]+t[4],t[1]*e[4]+t[3]*e[5]+t[5]]},Matrix.prototype.isIdentity=function(){this.cache||(this.cache=this.toArray());var t=this.cache;return 1===t[0]&&0===t[1]&&0===t[2]&&1===t[3]&&0===t[4]&&0===t[5]},Matrix.prototype.matrix=function(t){return 1===t[0]&&0===t[1]&&0===t[2]&&1===t[3]&&0===t[4]&&0===t[5]||(this.cache=null,this.queue.push(t)),this},Matrix.prototype.translate=function(t,e){return 0===t&&0===e||(this.cache=null,this.queue.push([1,0,0,1,t,e])),this},Matrix.prototype.scale=function(t,e){return 1===t&&1===e||(this.cache=null,this.queue.push([t,0,0,e,0,0])),this},Matrix.prototype.rotate=function(t,e,i){var h,r,s;return 0!==t&&(this.translate(e,i),h=t*Math.PI/180,r=Math.cos(h),s=Math.sin(h),this.queue.push([r,s,-s,r,0,0]),this.cache=null,this.translate(-e,-i)),this},Matrix.prototype.skewX=function(t){return 0!==t&&(this.cache=null,this.queue.push([1,0,Math.tan(t*Math.PI/180),1,0,0])),this},Matrix.prototype.skewY=function(t){return 0!==t&&(this.cache=null,this.queue.push([1,Math.tan(t*Math.PI/180),0,1,0,0])),this},Matrix.prototype.toArray=function(){if(this.cache)return this.cache;if(!this.queue.length)return this.cache=[1,0,0,1,0,0],this.cache;if(this.cache=this.queue[0],1===this.queue.length)return this.cache;for(var t=1;t<this.queue.length;t++)this.cache=this.combine(this.cache,this.queue[t]);return this.cache},Matrix.prototype.calc=function(t,e,i){var h;return this.queue.length?(this.cache||(this.cache=this.toArray()),[t*(h=this.cache)[0]+e*h[2]+(i?0:h[4]),t*h[1]+e*h[3]+(i?0:h[5])]):[t,e]};