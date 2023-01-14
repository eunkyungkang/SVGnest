
var display = document.getElementById('select');
var message = document.getElementById('message');

var demo = document.getElementById('demo');
demo.onclick = function(){
    try{
        var svg = window.SvgNest.parsesvg(display.innerHTML);
        display.innerHTML = '';
        display.appendChild(svg);
    }
    catch(e){
        message.innerHTML = e;
        message.className = 'error animated bounce';
        return;
    }			
    
    hideSplash();
    message.innerHTML = 'Click on the outline to use as the bin';
    message.className = 'active animated bounce';
    
    attachSvgListeners(svg);
};

function hideSplash(){
    var splash = document.getElementById('splash');
    var svgnest = document.getElementById('svgnest');
    if(splash) {
        splash.remove();
    }
    svgnest.setAttribute('style','display: block');
}

function attachSvgListeners(svg) {
    // attach event listeners
    for(var i=0; i<svg.childNodes.length; i++) {
        var node = svg.childNodes[i];
        if(node.nodeType == 1){
            node.onclick = function(){
                if(display.className == 'disabled') {
                    return;
                }
                var currentbin = document.querySelector('#select .active');
                if(currentbin){
                    var className = currentbin.getAttribute('class').replace('active', '').trim();
                    if(!className)
                        currentbin.removeAttribute('class');
                    else
                        currentbin.setAttribute('class', className);
                }
                
                window.SvgNest.setbin(this);
                this.setAttribute('class',(this.getAttribute('class') ? this.getAttribute('class')+' ' : '') + 'active');
                
                var start = document.getElementById('start');
                start.className = 'button start animated bounce';
                message.className = '';
            }
        }
    }
}