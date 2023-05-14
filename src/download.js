document.addEventListener('DOMContentLoaded', (event) => {
    var download = document.getElementById('download');
    var display = document.getElementById('select');
    var message = document.getElementById('message');

    download.onclick = function() {
        if(download.className == 'button download disabled'){
            return false;
        }
        
        var bins = document.getElementById('bins');
        
        if(bins.children.length == 0){
            message.innerHTML = 'No SVG to export';
            message.className = 'error animated bounce';
            return
        }
        
        var svg;
        svg = display.querySelector('svg');
        
        if(!svg){
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        }
        
        svg = svg.cloneNode(false);
        
        // maintain stroke, fill etc of input
        if(SvgNest.style){
            svg.appendChild(SvgNest.style);
        }
        
        var binHeight = parseInt(bins.children[0].getAttribute('height'));
        
        for(var i=0; i<bins.children.length; i++){
            var b = bins.children[i];
            var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform', 'translate(0 '+binHeight*1.1*i+')');
            for(var j=0; j<b.children.length; j++){
                group.appendChild(b.children[j].cloneNode(true));
            }
            
            svg.appendChild(group);
        }
        
        var output;
        if(typeof XMLSerializer != 'undefined'){
            output = (new XMLSerializer()).serializeToString(svg);
        }
        else{
            output = svg.outerHTML;
        }

        convertToDxf(output);
    }

    const convertToDxf = (file) => {
        const conversionServerUrl = "https://dxf-convertor.herokuapp.com/svg_to_dxf";

        console.log(file);
        if(!file) {
            return;
        }

        download.className = 'button spinner';

        const data = JSON.stringify({ "svg": file });
        fetch(conversionServerUrl, { method: "GET", body: data })
            .then((response) => response.json())
            .then((data) => {
                var blob = new Blob([output], {type: "image/x-dxf;charset=utf-8"});
                saveAs(blob, "output.dxf");
                download.className = 'button';
            })
            .catch(err => {
                console.log(err);
                message.innerHTML = 'Error when converting to DXF';
                message.className = 'error animated bounce';
            });
    }
})