function sum(){
    var sum = 0;
    for(var i = 0; i < arguments.length; i++){
        sum += arguments[i];
    }
    return sum;
}

function substract(){
    var sum = arguments[0];
    for(var i = 1; i < arguments.length; i++){
        sum -= arguments[i];
    }
    return sum;
}

const resources = {
    sum,
    substract
}

export default resources;