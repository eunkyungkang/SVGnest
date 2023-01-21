document.addEventListener('DOMContentLoaded', (event) => {
    // config
    var configvisible = false;
    var config = document.getElementById('config');
    var configbutton = document.getElementById('configbutton');
    var configsave = document.getElementById('configsave');

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
})