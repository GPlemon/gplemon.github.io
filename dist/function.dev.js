"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function fadeIn() {
  $(".action-btn ").toggle(function () {
    showThis();
    $("").fadeOut(1000, "");
  });
}

;
var listClass = ".w3-container,.action-btn";
var data = [];
var input = 4;

function inputUpdate() {
  for (var i = 1; i < input + 1; i++) {
    data.push(i);
  }

  return data;
}

function showThis() {
  d3.selectAll(listClass).transition().duration(500).style("transform", "translate(0px)").delay(function (d, i) {
    if (i % 2 === 0) {
      return i * 200;
    } else {
      return i * 100;
    }
  });
  moveControlPanel(0, 1);
} //hide the main webpage cover.


function hideThis() {
  d3.selectAll(listClass).transition().duration(1250).style("transform", "translate(5000px)").delay(function (d, i) {
    if (i % 2 === 0) {
      return i * 200;
    } else {
      return i * 100;
    }
  });
  moveControlPanel(100, 0.5);
}

var moveControlPanel = function moveControlPanel(x, y) {
  return d3.selectAll("#app-control").transition().duration(850).style("transform", "translate(" + x + "px)").style("opacity", y).delay(function (d, i) {
    if (i % 2 === 0) {
      return i * 200;
    } else {
      return i * 100;
    }
  });
};

function blackBackground() {
  document.body.style.backgroundColor = "#ffc107";
}

function whiteBackground() {
  document.body.style.backgroundColor = "white";
}
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


var array1 = [1, 1, 3, 5];
var array2 = [1, 1, 34, 56];
var inter = array1.filter(function (value) {
  return array2.includes(value);
});
var merge = array1.concat(array2).filter(function (values) {
  return inter.includes(values);
});
console.log(_typeof(inter));
console.log(merge);