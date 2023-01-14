var display = document.getElementById('select');
var start = document.getElementById('start');
var startlabel = document.getElementById('startlabel');

var config = document.getElementById('config');
var configbutton = document.getElementById('configbutton');

var isworking = false;
var iterations = 0;

const progress = require('./progress');

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
    var zoomin = document.getElementById('zoominbutton');
    var zoomout = document.getElementById('zoomoutbutton');
    
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

    var download = document.getElementById('download');
    download.className = 'button download animated bounce';
}