// init controller
//var controller = new ScrollMagic.Controller();

// create a scene
/* new ScrollMagic.Scene({
        duration: 50, // the scene should last for a scroll distance of 100px
        offset: 10 // start this scene after scrolling for 50px
    })
    .setPin('.sticky-element') // pins the element for the the scene's duration
    .addTo(controller); // assign the scene to the controller


 */
// build scene
/* var scene = new ScrollMagic.Scene({
    triggerElement: "#trigger1"
})

.addIndicators({ name: "1 (duration: 0)" }) // add indicators (requires plugin)
    .addTo(controller);

 */


$("#projects").hide();

function toggleCerts(numberOfCerts) {

    for (let i = 0; i < numberOfCerts; ++i) {
        let ids = `#cert${i}`;
        $(ids).hide('easing');
        $("#cert-btn").on("click", function() {
            $(ids).toggle("easing");
        });
    }
}

toggleCerts(15);
/* $("#cert1,#cert2").hide();
$("#cert-btn").on("click", function() {
    $("#cert1,#cert2").toggle("easing");
});
 */
for (let i = 0; i <= 7; i++) {

    $("#para" + i).hide();

}

$("#parent0").on("mouseenter", () => {
        $("#para0").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para0").slideUp("slow") })


$("#parent1").on("mouseenter", () => {
        $("#para1").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para1").slideUp("slow") })


$("#parent2").on("mouseenter", () => {
        $("#para2").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para2").slideUp("slow") })

$("#parent3").on("mouseenter", () => {
        $("#para3").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para3").slideUp("slow") })

$("#parent4").on("mouseenter", () => {
        $("#para4").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para4").slideUp("slow") })

$("#parent5").on("mouseenter", () => {
        $("#para5").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para5").slideUp("slow") })


$("#parent6").on("mouseenter", () => {
        $("#para6").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para6").slideUp("slow") })

$("#parent7").on("mouseenter", () => {
        $("#para7").slideDown("slow")
    })
    .on("mouseleave", () => { $("#para7").slideUp("slow") })




//5


$('#tab-title-projects').hide();

$('#tab-title').on('click', (e) => {
    e.preventDefault();
    $('#cert-btn').hide('slow');
})
$('#tab-title-projects').on('click', (e) => {
    e.preventDefault();
    $('#cert-btn').slideDown(1000);
})

function fadeIn() {

    $("#action-btn,#tab-title-projects").toggle(() => {
        $("#projects").hide();
        $("#tab-title-projects").hide('slow');

        showThis();
        $("#tab-title").show();
    });
};


var listClass = ".w3-container,#action-btn,body > div:nth-child(4),#certs";

var input = 4;



function scrollToTop() {
    return window.scrollTo({ top: 10000 }, { 'behaviour': 'smooth' });
}




function showThis() {


    /*     d3.selectAll(listClass)
            .transition()
            .duration(3500)

        .style("transform", "translate(0px)")

        .delay(function(d, i) {
            if (i % 2 === 0) {
               
                return i * 200;
            } else {
                return i * 100;
            }
        });
        moveControlPanel(0, 1); */

}

//hide the main webpage cover.


function hideThis() {
    scrollToTop();
    $("#projects,#tab-title-projects").show();
    $("#tab-title").hide();

    /*     d3.selectAll(listClass)
            .transition()
            .duration(500)

        .delay(function(d, i) {
            if (i % 2 === 0) {
                return i * 200;
            } else {
                return i * 40;
            }
        }).style("transform", "translate(0px)") */
    /* moveControlPanel(30, 0.2); */

}



const moveControlPanel = (x, y) =>
    /*     d3
        .selectAll("#app-control")
        .transition()
        .duration(850)

    .style("transform", "translate(" + x + "px)")
        .style("opacity", y)
        .delay(function(d, i) {
            if (i % 2 === 0) {
                return i * 200;
            } else {
                return i * 100;
            }
        }); */




    /*
    $("#selectBox option[value='option1']").remove();
    $("#selectBox").append('<option value="option6">option6</option>');


    // $("select")
    //   .children("option:not(:first)")
    //   .remove();


    var selectValues = {

      "name": 1000

    }
    document.addEventListener("DOMContentLoaded")

    $.each(selectValues, function(key, value) {
      $("#mySelect").append(
        $("<option></option>")
          .attr("value", key)
          .text(value)
      );
    });

    */
    function copy() {
        const answer = document.getElementById("copyResult");
        const copy = document.getElementById("copybtn");
        const selection = window.getSelection();
        const range = document.createRange();
        const textToCopy = document.getElementById("copytext")

        copy.addEventListener('click', function(e) {
            range.selectNodeContents(textToCopy);
            selection.removeAllRanges();
            selection.addRange(range);
            const successful = document.execCommand('copy');
            if (successful) {
                answer.innerHTML = 'Copied!';
            } else {
                answer.innerHTML = 'Unable to copy!';
            }
            window.getSelection().removeAllRanges()
        });

    }
    //copy();


/* var array1 = [1, 1, 3, 5];
var array2 = [1, 1, 34, 56];

var inter = array1.filter(value => array2.includes(value));
var merge = array1.concat(array2).filter(values => inter.includes(values));




console.log(typeof inter);

console.log(merge); */

// Script to open and close sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

// Modal Image Gallery
function onClick(element) {
    document.getElementById("img01").src = element.src;
    document.getElementById("modal01").style.display = "block";
    var captionText = document.getElementById("caption");
    captionText.innerHTML = element.alt;
}