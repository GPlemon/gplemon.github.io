$("#projects").hide()

$("#parent0").click(function() {
    $("#para0").toggle("slow", function() {

    })
})
$("#parent1").click(function() {
    $("#para1").toggle("slow", function() {})
})
$("#parent2").click(function() {
    $("#para2").toggle("slow", function() {})
})
$("#parent3").click(function() {
    $("#para3").toggle("slow", function() {})
})
$("#parent4").click(function() {
    $("#para4").toggle("slow", function() {})
})
for (var i = 0; i <= 4; i++) {
    $("#para" + i).hide();
}



function fadeIn() {
    $(".action-btn ").toggle(() => {
        showThis();

        $("").fadeOut(1000, "");
        $("#projects").fadeOut();
    });



};


var listClass = ".w3-container,.action-btn";
var data = [];
var input = 4;




function inputUpdate() {
    for (let i = 1; i < input + 1; i++) {
        data.push(i);
    }
    return data;
}




function showThis() {

    d3.selectAll(listClass)
        .transition()
        .duration(500)

    .style("transform", "translate(0px)")

    .delay(function(d, i) {
        if (i % 2 === 0) {
            return i * 200;
        } else {
            return i * 100;
        }
    });
    moveControlPanel(0, 1);
}

//hide the main webpage cover.
function hideThis() {
    $("#projects").fadeIn();
    $("body").css("backgroundColor", "var('--pink')")

    d3.selectAll(listClass)
        .transition()
        .duration(1250)
        .style("transform", "skewX(30deg)")
        .style("transform", "translate(5000px)")

    .delay(function(d, i) {
        if (i % 2 === 0) {
            return i * 200;
        } else {
            return i * 100;
        }
    });
    moveControlPanel(100, 0.2);

}



const moveControlPanel = (x, y) =>
    d3
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
    });




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



var array1 = [1, 1, 3, 5];
var array2 = [1, 1, 34, 56];

var inter = array1.filter(value => array2.includes(value));
var merge = array1.concat(array2).filter(values => inter.includes(values));




console.log(typeof inter);

console.log(merge);