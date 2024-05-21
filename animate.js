const flicking = new Flicking("#carousel", {
    align: "center",
    circular: true,
    bound: true,
    renderOnlyVisible: true,
    horizontal: true,
});
setInterval(() => { flicking.next(); }, 15000)


let boot = gsap.timeline({ defaults: { ease: "power1.out" } });
boot.set('div', { autoAlpha: 0, })
    /* setTimeout(() => { */
boot.to('div', { y: 0, autoAlpha: 1, duration: 3 })
    /* }, 0) */


let tl = gsap.timeline({ defaults: { ease: "power1.out" } });


tl.to('.item', { autoAlpha: 0, y: 100 })

tl.to('.item', { autoAlpha: 0.5, y: -15, stagger: 0.059, duration: 0.8 }, "+=4")

tl.to('.item', { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1 }, "-=1")


tl.from(".animate-link-effect", { autoAlpha: 0.8, y: 12, repeat: 'true' })
tl.to(".animate-link-effect", { autoAlpha: 1, y: 0, stagger: 0.059, duration: 1, repeat: 'true' })



//Something new from a branch
//From a branch

//Highlight Follows Mouse Effect

/* document.addEventListener("DOMContentLoaded", function() {


    var playpen = document.getElementById("playpen");
    var originalBGplaypen = getComputedStyle(playpen).backgroundColor;
    var lightColor = "rgba(255,255,255,0.75)";
    var gradientSize = 100;



    var navLinks = document.querySelectorAll("article:not(section)");
    var originalBG = getComputedStyle(navLinks[0]).backgroundColor;

    navLinks.forEach(function(link) {
        link.addEventListener("mousemove", function(e) {
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            var xy = x + " " + y;

            var bgWebKit = "-webkit-gradient(radial, " + xy + ", 0, " + xy + ", 100, from(rgba(255,255,255,0.1)), to(rgba(255,255,255,0.0))), " + originalBG;
            var bgMoz = "-moz-radial-gradient(" + x + "px " + y + "px 45deg, circle, " + lightColor + " 0%, " + originalBG + " " + gradientSize + "px)";

            this.style.background = bgWebKit;
            this.style.background = bgMoz;
            this.style.filter = blur()
        });

        link.addEventListener("mouseleave", function() {
            this.style.background = originalBG;
        });
    });
}); */
document.addEventListener("DOMContentLoaded", function() {
    var playpen = document.getElementById("playpen");
    //var originalBGplaypen = getComputedStyle(playpen).backgroundColor;
    var lightColor = "rgba(255,255,255,0.25)";

    //.nav li:not(.active) a 
    var navLinks = document.querySelectorAll("article:not(section)");
    var originalBG = getComputedStyle(navLinks[0]).backgroundColor;

    navLinks.forEach(function(link) {
        link.addEventListener("mousemove", function(e) {
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left; // X-coordinate relative to the element
            var y = e.clientY - rect.top; // Y-coordinate relative to the element

            // Calculate the center of the element
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            // Calculate the distance from the center
            var distFromCenterX = Math.abs(centerX - x);
            var distFromCenterY = Math.abs(centerY - y);

            // Calculate the dynamic radius
            var maxDistFromCenter = Math.max(centerX, centerY);
            var dynamicRadius = maxDistFromCenter - Math.min(distFromCenterX, distFromCenterY);

            var xy = x + " " + y;

            var bgWebKit = "-webkit-gradient(radial, " + xy + ", 0, " + xy + ", " + dynamicRadius + ", from(rgba(255,255,255,0.05)), to(rgba(255,255,255,0.0))), " + originalBG;
            var bgMoz = "-moz-radial-gradient(" + x + "px " + y + "px 45deg, circle, " + lightColor + " 0%, " + originalBG + " " + dynamicRadius + "px)";

            this.style.background = bgWebKit;
            this.style.background = bgMoz;
        });

        link.addEventListener("mouseleave", function() {
            this.style.background = originalBG;
        });
    });
});