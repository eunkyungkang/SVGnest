document.addEventListener('DOMContentLoaded', (event) => {
    // FAQ toggle
    var faq = document.getElementById('faq');
    var faqbutton = document.getElementById('faqbutton');

    var faqvisible = false;
    faqbutton.onclick = function(e){
        if(!faqvisible){
            faq.setAttribute('style','display: flex');
            faq.scrollIntoView({ behavior: "smooth" });
        }
        else{
            faq.setAttribute('style', 'display: none');
        }
        faqvisible = !faqvisible;
    };
})

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