

var listClass = ".w3-container";

var data = [];
var input = 4;

function inputUpdate(){
    for (let i = 1; i < input + 1; i++) {
       data.push(i);
    }
    return data;
}



function showThis(){ d3.selectAll(listClass)
                       .transition()
                       .duration(1250)

                       .style("transform", "translate(0px)")

                       .delay(function(d, i) {
                         if (i % 2 === 0) {
                           return i * 300;
                         } else {
                           return i * 50;
                         }
                       })
                       
                        moveControlPanel(0,1); 
                       }
  
function hideThis(){
  d3.selectAll(listClass)
    .transition()
    .duration(850)

    .style("transform", "translate(8000px)")

    .delay(function(d, i) {
      if (i % 2 === 0) {
        return i * 200;
      } else {
        return i * 100;
      }
    });
  moveControlPanel(100, 0.5);
}
  
const moveControlPanel = (x,y) =>
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