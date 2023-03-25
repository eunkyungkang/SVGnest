document.addEventListener('DOMContentLoaded', (event) => {
    // Pricing toggle
    var pricing = document.getElementById('pricing');
    var pricingbutton = document.getElementById('pricingbutton');

    var pricingvisible = false;
    pricingbutton.onclick = function(e){
        if(!pricingvisible){
            pricing.setAttribute('style','display: flex');
            pricing.scrollIntoView({ behavior: "smooth" });
        }
        else{
            pricing.setAttribute('style', 'display: none');
        }
        pricingvisible = !pricingvisible;
    };
})