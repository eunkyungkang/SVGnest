!function(t){"undefined"!=typeof module&&module.exports;var e=!("undefined"!=typeof window&&t===window),n=n||function(t){setTimeout(t,0)},r=e?require(__dirname+"/Worker.js"):t.Worker,o=void 0!==t?t.URL?t.URL:t.webkitURL:null,a=!(!e&&!t.Worker);function s(t,e){for(var n in e||(e={}),t)void 0===e[n]&&(e[n]=t[n]);return e}function i(){this._callbacks=[],this._errCallbacks=[],this._resolved=0,this._result=null}i.prototype.resolve=function(t,e){if(t){this._resolved=2,this._result=t;for(var n=0;n<this._errCallbacks.length;++n)this._errCallbacks[n](t)}else{this._resolved=1,this._result=e;for(var r=0;r<this._callbacks.length;++r)this._callbacks[r](e)}this._callbacks=[],this._errCallbacks=[]},i.prototype.then=function(t,e){if(1!==this._resolved){if(2!==this._resolved)return t&&(this._callbacks[this._callbacks.length]=t),e&&(this._errCallbacks[this._errCallbacks.length]=e),this;e&&e(this._result)}else t&&t(this._result)};var l={evalPath:e?__dirname+"/eval.js":null,maxWorkers:e?require("os").cpus().length:navigator.hardwareConcurrency||4,synchronous:!0,env:{},envNamespace:"env"};function u(t,e){this.data=t,this.options=s(l,e),this.operation=new i,this.operation.resolve(null,this.data),this.requiredScripts=[],this.requiredFunctions=[]}u.isSupported=function(){return a},u.prototype.getWorkerSource=function(t,n){var r="",o=0;for(e||0===this.requiredScripts.length||(r+='importScripts("'+this.requiredScripts.join('","')+'");\r\n'),o=0;o<this.requiredFunctions.length;++o)this.requiredFunctions[o].name?r+="var "+this.requiredFunctions[o].name+" = "+this.requiredFunctions[o].fn.toString()+";":r+=this.requiredFunctions[o].fn.toString();n=JSON.stringify(n||{});var a=this.options.envNamespace;return e?r+'process.on("message", function(e) {global.'+a+" = "+n+";process.send(JSON.stringify(("+t.toString()+")(JSON.parse(e).data)))})":r+"self.onmessage = function(e) {var global = {}; global."+a+" = "+n+";self.postMessage(("+t.toString()+")(e.data))}"},u.prototype.require=function(){for(var t,e=Array.prototype.slice.call(arguments,0),n=0;n<e.length;n++)"string"==typeof(t=e[n])?this.requiredScripts.push(t):"function"==typeof t?this.requiredFunctions.push({fn:t}):"object"==typeof t&&this.requiredFunctions.push(t);return this},u.prototype._spawnWorker=function(t,n){var a,s=this.getWorkerSource(t,n);if(e)(a=new r(this.options.evalPath)).postMessage(s);else{if(void 0===r)return;try{if(0!==this.requiredScripts.length){if(null===this.options.evalPath)throw new Error("Can't use required scripts without eval.js!");(a=new r(this.options.evalPath)).postMessage(s)}else{if(!o)throw new Error("Can't create a blob URL in this browser!");var i=new Blob([s],{type:"text/javascript"}),l=o.createObjectURL(i);a=new r(l)}}catch(t){if(null===this.options.evalPath)throw t;(a=new r(this.options.evalPath)).postMessage(s)}}return a},u.prototype.spawn=function(t,e){var r=this,o=new i;return e=s(this.options.env,e||{}),this.operation.then((function(){var a=r._spawnWorker(t,e);if(void 0!==a)a.onmessage=function(t){a.terminate(),r.data=t.data,o.resolve(null,r.data)},a.onerror=function(t){a.terminate(),o.resolve(t,null)},a.postMessage(r.data);else{if(!r.options.synchronous)throw new Error("Workers do not exist and synchronous operation not allowed!");n((function(){try{r.data=t(r.data),o.resolve(null,r.data)}catch(t){o.resolve(t,null)}}))}})),this.operation=o,this},u.prototype._spawnMapWorker=function(t,e,r,o,a){var s=this;if(a||(a=s._spawnWorker(e,o)),void 0!==a)a.onmessage=function(e){s.data[t]=e.data,r(null,a)},a.onerror=function(t){a.terminate(),r(t)},a.postMessage(s.data[t]);else{if(!s.options.synchronous)throw new Error("Workers do not exist and synchronous operation not allowed!");n((function(){s.data[t]=e(s.data[t]),r()}))}},u.prototype.map=function(t,e){if(e=s(this.options.env,e||{}),!this.data.length)return this.spawn(t,e);var n=this,r=0,o=0;function a(s,i){s?l.resolve(s,null):++o===n.data.length?(l.resolve(null,n.data),i&&i.terminate()):r<n.data.length?n._spawnMapWorker(r++,t,a,e,i):i&&i.terminate()}var l=new i;return this.operation.then((function(){for(;r-o<n.options.maxWorkers&&r<n.data.length;++r)n._spawnMapWorker(r,t,a,e)}),(function(t){l.resolve(t,null)})),this.operation=l,this},u.prototype._spawnReduceWorker=function(t,e,r,o,a){var s=this;if(a||(a=s._spawnWorker(e,o)),void 0!==a)a.onmessage=function(t){s.data[s.data.length]=t.data,r(null,a)},a.onerror=function(t){a.terminate(),r(t,null)},a.postMessage(t);else{if(!s.options.synchronous)throw new Error("Workers do not exist and synchronous operation not allowed!");n((function(){s.data[s.data.length]=e(t),r()}))}},u.prototype.reduce=function(t,e){if(e=s(this.options.env,e||{}),!this.data.length)throw new Error("Can't reduce non-array data");var n=0,r=this;function o(s,i){--n,s?a.resolve(s,null):1===r.data.length&&0===n?(r.data=r.data[0],a.resolve(null,r.data),i&&i.terminate()):r.data.length>1?(++n,r._spawnReduceWorker([r.data[0],r.data[1]],t,o,e,i),r.data.splice(0,2)):i&&i.terminate()}var a=new i;return this.operation.then((function(){if(1===r.data.length)a.resolve(null,r.data[0]);else{for(var s=0;s<r.options.maxWorkers&&s<Math.floor(r.data.length/2);++s)++n,r._spawnReduceWorker([r.data[2*s],r.data[2*s+1]],t,o,e);r.data.splice(0,2*s)}})),this.operation=a,this},u.prototype.then=function(t,e){var n=this,r=new i;return e="function"==typeof e?e:function(){},this.operation.then((function(){var o;try{t&&void 0!==(o=t(n.data))&&(n.data=o),r.resolve(null,n.data)}catch(t){e?(void 0!==(o=e(t))&&(n.data=o),r.resolve(null,n.data)):r.resolve(null,t)}}),(function(t){if(e){var o=e(t);void 0!==o&&(n.data=o),r.resolve(null,n.data)}else r.resolve(null,t)})),this.operation=r,this},t.Parallel=u}("undefined"!=typeof window?window:self);