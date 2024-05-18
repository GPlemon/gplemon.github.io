$('#tab-title-projects').hide();

$('#tab-title').on('click', (e) => {
    e.preventDefault();
    //gsap.to('#cert-btn', { duration: 0.5, y: 100 })
})

$('#tab-title-projects').on('click', (e) => {
    e.preventDefault();


})

function scrollToTop() {
    return window.scrollTo({ top: 10000 }, { 'behaviour': 'smooth' });
}