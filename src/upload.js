document.addEventListener('DOMContentLoaded', (event) => {
    var dxfFilename = null;
    var upload = document.getElementById('upload');
    var fileinput = document.getElementById('fileinput');

    document.addEventListener('dragover', FileDragHover, false);
    document.addEventListener('dragleave', FileDragHover, false);
    document.addEventListener('drop', FileDrop, false);

    function FileDragHover(e){
        e.stopPropagation();
        e.preventDefault();
        upload.style.backgroundColor = (e.type == "dragover" ? "#d7e9b7" : "");
    }

    function FileDrop(e) {
        e.stopPropagation(); // Make sure not to replace website by file
        e.preventDefault();
        getDxfMetadata(e.dataTransfer.files[0]);
    }

    upload.onclick = function() {
        fileinput.click();
    }

    fileinput.onchange = function(e) {
        getDxfMetadata(e.target.files[0]);
    }

    const getDxfMetadata = (file) => {
        const apiUrl = "https://dxf-convertor.herokuapp.com/upload_dxf";

        var message = document.getElementById('message');
        var upload = document.getElementById('upload');

        if(!file) {
            return;
        }

        if(!file.type || (file.type.search('dxf') < 0)){
            message.innerHTML = 'Only DXF files allowed';
            message.className = 'error animated bounce';
            return
        }

        upload.className = 'button spinner';

        var data = new FormData();
        if(file) {
            data.append('file', file);
        }
        fetch(apiUrl, { method: "POST", body: data })
            .then((response) => response.json())
            .then((data) => {
                dxfFilename = data.filename;
                showDxfMetadata(data);
                upload.className = 'button';
            })
            .catch(err => {
                message.innerHTML = 'Error when fetching DXF metadata';
                message.className = 'error animated bounce';
            });
    }

    var dxfMetadataModal = document.getElementById('dxfmetadata');
    var dxfMetadataSubmit = document.getElementById('metadata-submit');
    var dxfSizeSelect = document.getElementById('dxf-sizes');

    const showDxfMetadata = (data) => {
        var dxfSizeSelect = document.getElementById('dxf-sizes');
        
        while (dxfSizeSelect.options.length > 0) {
            dxfSizeSelect.remove(0);
        }

        var numberPieces = document.getElementById("dxf-pieces");
        numberPieces.innerHTML = data.number_pieces;

        let sizes = data.sizes;
        for(var sizeKey in sizes) {
            let option = new Option(sizes[sizeKey], sizes[sizeKey]);
            dxfSizeSelect.add(option, undefined);
        }

        dxfMetadataModal.style.display = "block";
    }

    dxfMetadataSubmit.onclick = function() {
        var selectedSize = dxfSizeSelect.value;

        var patternWidth = document.getElementById("pattern-width").value;
        dxfMetadataSubmit.className = 'button spinner disabled';
        dxfMetadataSubmit.innerHTML = "Preparing nesting...";

        convertToSvg(dxfFilename, selectedSize, patternWidth);
    }

    function convertToSvg(filename, size, patternWidth) {
        const apiUrl = "https://dxf-convertor.herokuapp.com/dxf_to_svg";

        fetch(apiUrl + "?" + new URLSearchParams({
            filename: filename,
            size: size,
            width: patternWidth
        }), { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                const svg = data.svg;
                handleSvg(svg);
                dxfMetadataModal.style.display = "none";
            })
            .catch(err => {
                message.innerHTML = 'Error when converting DXF to SVG';
                message.className = 'error animated bounce';
            });
    }

    /* DXF metadata modal */
    var modalClose = document.getElementsByClassName("close")[0];

    modalClose.onclick = function() {
        dxfMetadataModal.style.display = "none";
    } 

    window.onclick = function(event) {
        if (event.target == dxfMetadataModal) {
            dxfMetadataModal.style.display = "none";
        }
    }

    var display = document.getElementById('select');
    var start = document.getElementById('start');

    function handleSvg(file) {
        if(!file) {
            return;
        }

        try {
            var svg = window.SvgNest.parsesvg(file);
            {
                var wholeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                // Copy relevant scaling info
                wholeSVG.setAttribute('width',svg.getAttribute('width'));
                wholeSVG.setAttribute('height',svg.getAttribute('height'));
                wholeSVG.setAttribute('viewBox',svg.getAttribute('viewBox'));
                var rect = document.createElementNS(wholeSVG.namespaceURI, 'rect');
                rect.setAttribute('x', wholeSVG.viewBox.baseVal.x);
                rect.setAttribute('y', wholeSVG.viewBox.baseVal.x);
                rect.setAttribute('width', wholeSVG.viewBox.baseVal.width);
                rect.setAttribute('height', wholeSVG.viewBox.baseVal.height);
                rect.setAttribute('class', 'fullRect');
                wholeSVG.appendChild(rect);
            }
            display.innerHTML = '';
            display.appendChild(wholeSVG); // As a default bin in background
            display.appendChild(svg);
        } catch(e) {
            message.innerHTML = e;
            message.className = 'error animated bounce';
            return;
        }
        
        hideSplash();

        window.SvgNest.setbin(rect);
        rect.setAttribute('class',(rect.getAttribute('class') ? rect.getAttribute('class')+' ' : '') + 'active');
        
        start.className = 'button start animated bounce';
        message.className = '';
    };

    function hideSplash(){
        var splash = document.getElementById('splash');
        var svgnest = document.getElementById('svgnest');
        if(splash){
            splash.remove();
        }
        svgnest.setAttribute('style','display: block');
    }
})