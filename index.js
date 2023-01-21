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
    // Alert message
    var message = document.getElementById('message');
    message.onclick = function(e){
        this.className='';
    }

    // Initial checks    
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
});