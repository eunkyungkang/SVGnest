require('pathseg');

// UI-specific stuff, button clicks go here
function ready(fn){
    if (document.readyState != 'loading'){
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(function(){
    require('./faq');
    require('./toolbar');
    require('./download');
    const progress = require('./progress');
    const dxf = require('./dxf_metadata');

    function hideSplash(){
        var splash = document.getElementById('splash');
        var svgnest = document.getElementById('svgnest');
        if(splash){
            splash.remove();
        }
        svgnest.setAttribute('style','display: block');
    }
    
    var demo = document.getElementById('demo');
    var upload = document.getElementById('upload');
    var display = document.getElementById('select');
    
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
    
    var message = document.getElementById('message');
    
    if(!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect){
        message.innerHTML = 'Your browser does not have SVG support';
        message.className = 'error animated bounce';
        return
    }
    
    if (!window.SvgNest) {
        message.innerHTML = "Couldn't initialize SVGnest";
        message.className = 'error animated bounce';
        return;
    }
    
    if(!window.File || !window.FileReader){
        message.innerHTML = 'Your browser does not have file upload support';
        message.className = 'error animated bounce';
        return
    }
    
    if(!window.Worker){
        message.innerHTML = 'Your browser does not have web worker support';
        message.className = 'error animated bounce';
        return
    }
    
    // button clicks
    var upload = document.getElementById('upload');
    var start = document.getElementById('start');
    var download = document.getElementById('download');
    var startlabel = document.getElementById('startlabel');
    var fileinput = document.getElementById('fileinput');
    
    var config = document.getElementById('config');
    var configbutton = document.getElementById('configbutton');
    var configsave = document.getElementById('configsave');
    
    var zoomin = document.getElementById('zoominbutton');
    var zoomout = document.getElementById('zoomoutbutton');

    var isworking = false;
    
    start.onclick = function(){
        if(this.className == 'button start disabled'){
            return false;
        }
        iterations = 0;
        if(isworking){
            stopnest();
        }
        else{
            startnest();
        }
        
        display.className = 'disabled';
        document.getElementById('info_time').setAttribute('style','display: none');
    };
    
    function startnest() {
        // Once started, don't allow this anymore
        document.removeEventListener('dragover', FileDragHover, false);
        document.removeEventListener('dragleave', FileDragHover, false);
        document.removeEventListener('drop', FileDrop, false);
        
        SvgNest.start(progress.start, renderSvg);
        startlabel.innerHTML = 'Stop Nest';
        start.className = 'button spinner';
        configbutton.className = 'button config disabled';
        config.className = '';
        zoomin.className = 'button zoomin disabled';
        zoomout.className = 'button zoomout disabled';
        
        var svg = document.querySelector('#select svg');
        if(svg) {
            svg.removeAttribute('style');
        }
        
        isworking = true;
    }
    
    function stopnest() {
        SvgNest.stop();
        startlabel.innerHTML = 'Start Nest';
        start.className = 'button start';
        configbutton.className = 'button config';
        
        isworking = false;
    }
    
    // config
    var configvisible = false;
    configbutton.onclick = function(){
        if(this.className == 'button config disabled'){
            return false;
        }
        if(!configvisible){
            config.className = 'active';
            configbutton.className = 'button close';
        }
        else{
            config.className = '';
            configbutton.className = 'button config';
        }
        configvisible = !configvisible;
        
        return false;
    }
    
    configsave.onclick = function(){
        var c = {};
        var inputs = document.querySelectorAll('#config input');
        for(var i=0; i<inputs.length; i++){
            var key = inputs[i].getAttribute('data-config');
            if(inputs[i].getAttribute('type') == 'text'){
                c[key] = inputs[i].value;
            }
            else if(inputs[i].getAttribute('type') == 'checkbox'){
                c[key] = inputs[i].checked;
            }
        }
        
        window.SvgNest.config(c);
        
        // new configs will invalidate current nest
        if(isworking){
            stopnest();
        }
        configvisible = false;
        config.className = '';
        return false;
    }
    
    upload.onclick = function(){
        fileinput.click();
    }

    fileinput.onchange = function(e){
        dxf.getDxfMetadata(e.target.files[0]);
    }

    document.addEventListener('dragover', FileDragHover, false);
    document.addEventListener('dragleave', FileDragHover, false);
    document.addEventListener('drop', FileDrop, false);

    function FileDragHover(e){
        e.stopPropagation();
        e.preventDefault();
        upload.style.backgroundColor = (e.type == "dragover" ? "#d7e9b7" : "");
    }
    function FileDrop(e){
        e.stopPropagation(); // Make sure not to replace website by file
        e.preventDefault();
        dxf.getDxfMetadata(e.dataTransfer.files[0]);
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
                    
                    start.className = 'button start animated bounce';
                    message.className = '';
                }
            }
        }
    }

    var iterations = 0;
    
    function renderSvg(svglist, efficiency, placed, total) {
        iterations++;
        document.getElementById('info_iterations').innerHTML = iterations;
        
        if(!svglist || svglist.length == 0){
            return;
        }
        var bins = document.getElementById('bins');
        bins.innerHTML = '';
        
        for(var i=0; i<svglist.length; i++){
            if(svglist.length > 2){
                svglist[i].setAttribute('class','grid');
            }
            bins.appendChild(svglist[i]);
        }
        
        if(efficiency || efficiency === 0){
            document.getElementById('info_efficiency').innerHTML = Math.round(efficiency*100);
        }

        document.getElementById('info_placed').innerHTML = placed+'/'+total;
        
        document.getElementById('info_placement').setAttribute('style','display: block');
        display.setAttribute('style','display: none');
        download.className = 'button download animated bounce';
    }
    
    message.onclick = function(e){
        this.className='';
    }
});