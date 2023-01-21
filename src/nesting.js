document.addEventListener('DOMContentLoaded', (event) => {
    var display = document.getElementById('select');
    var start = document.getElementById('start');
    var startlabel = document.getElementById('startlabel');

    var config = document.getElementById('config');
    var configbutton = document.getElementById('configbutton');

    var isworking = false;
    var iterations = 0;

    var prevpercent = 0;
    var startTime = null;

    const startProgress = (percent) => {
        var transition = percent > prevpercent ? '; transition: width 0.1s' : '';
        document.getElementById('info_progress').setAttribute('style','width: '+Math.round(percent*100)+'% ' + transition);
        document.getElementById('info').setAttribute('style','display: block');
        
        prevpercent = percent;
        
        var now = new Date().getTime();
        if(startTime && now){
            var diff = now-startTime;
            // show a time estimate for long-running placements
            var estimate = (diff/percent)*(1-percent);
            document.getElementById('info_time').innerHTML = millisecondsToStr(estimate)+' remaining';
            
            if(diff > 5000 && percent < 0.3 && percent > 0.02 && estimate > 10000){
                document.getElementById('info_time').setAttribute('style','display: block');
            }
        }
        
        if(percent > 0.95 || percent < 0.02){
            document.getElementById('info_time').setAttribute('style','display: none');
        }
        if(percent < 0.02){
            startTime = new Date().getTime();
        }
    }

    function millisecondsToStr (milliseconds) {
        function numberEnding (number) {
            return (number > 1) ? 's' : '';
        }

        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minute' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds);
        }
        return 'less than a second';
    }

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
        
        SvgNest.start(startProgress, renderSvg);
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
})