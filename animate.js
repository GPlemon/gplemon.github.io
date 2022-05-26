const flicking = new Flicking("#carousel", {
    align: "center",
    circular: true,
    bound: true,
    renderOnlyVisible: true,
    horizontal: true,
  });
  setInterval(()=>{flicking.next();},15000)
  

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