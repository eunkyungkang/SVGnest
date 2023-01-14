var dxfFilename = null;

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

    dxfMetadataSubmit.className = 'button spinner disabled';
    dxfMetadataSubmit.innerHTML = "Preparing nesting...";

    convertToSvg(dxfFilename, selectedSize);
}

function convertToSvg(filename, size) {
    const apiUrl = "https://dxf-convertor.herokuapp.com/dxf_to_svg";
    console.log(filename, size);

    fetch(apiUrl + "?" + new URLSearchParams({
        filename: filename,
        size: size,
    }), { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
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

exports.getDxfMetadata = getDxfMetadata;
