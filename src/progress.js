var prevpercent = 0;
var startTime = null;

const start = (percent) => {
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

exports.start = start;