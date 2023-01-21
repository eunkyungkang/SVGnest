document.addEventListener('DOMContentLoaded', (event) => {
    var zoomlevel = 1.0;
    var zoomin = document.getElementById('zoominbutton');
    var zoomout = document.getElementById('zoomoutbutton');
    var exit = document.getElementById('exitbutton');

    zoomin.onclick = function() {
        if(this.className == 'button zoomin disabled') {
            return false;
        }
        zoomlevel *= 1.2;
        var svg = document.querySelector('#select svg');
        if(svg) {
            svg.setAttribute('style', 'transform-origin: top left; transform:scale('+zoomlevel+'); -webkit-transform:scale('+zoomlevel+'); -moz-transform:scale('+zoomlevel+'); -ms-transform:scale('+zoomlevel+'); -o-transform:scale('+zoomlevel+');');
        }
    }

    zoomout.onclick = function(){
        if(this.className == 'button zoomout disabled') {
            return false;
        }
        zoomlevel *= 0.8;
        if(zoomlevel < 0.02) {
            zoomlevel = 0.02;
        }
        var svg = document.querySelector('#select svg');
        if(svg) {
            svg.setAttribute('style', 'transform-origin: top left; transform:scale('+zoomlevel+'); -webkit-transform:scale('+zoomlevel+'); -moz-transform:scale('+zoomlevel+'); -ms-transform:scale('+zoomlevel+'); -o-transform:scale('+zoomlevel+');');
        }
    }

    exit.onclick = function() {
        location.reload();
    }
})
