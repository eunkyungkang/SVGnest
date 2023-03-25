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