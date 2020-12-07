/*
const unique =  (array)=>{

    //store the result as you want
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (!newArray.includes(element)) {
            
            newArray.push(element);
        }
    }
    return newArray;

}

console.log(unique(['cat', 'dog', 'rat', 'dog', 'cat', 'bird']));
//O(n*)

const uni = (array) =>{
    
    //if parameter is an Array then you will iterate.  
    //For Loop
    //store the result as you want
   
    //sets are always unique 
    
    const set = new Set();//first determine the data structure your your output solution.

    for(let i = 0; i < array.length; i++){
        let element = array[i];
        set.add(element);
    }


    return Array.from(set);//returns an Array instead of a Set.
} 


console.log( uni(['cat', 'dog', 'rat', 'dog', 'cat', 'bird']));


const foo = (n) =>{
    let result  = 0;

    for(let i = 0; i < 5; i++){
        result += n;
    }

        return result;
};

console.log(foo(4));


const bar = (array) => {
    return array[0] * array[array.length - 1];
}
console.log();
console.log(bar([2, 2, 3 ,4, 6]));



const slowUnique = (array) =>{
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if(!newArray.includes(element)){
            newArray.push(element);

        }
    }

    return newArray;

}


const fastUnique = (array)=>{
    const uniqueValues = new Set();

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        uniqueValues.add(element);
        
    }
    return Array.from(uniqueValues);

}



//recursive function
const launch = (n) =>{

    if(n === 0){
    console.log('Launch');
    return;
    }

    console.log(n);

    launch(n - 1);

}

//launch(10);


let bars = (array) => {

    let sum = array[0] + array[array.length - 1];
    return sum;

}

console.log(bars([1, 2]));

let nums = [2, 7, 8, 9, 10, 13, 17, 19, 21];

const slowAdd = (array)=>{
    
    if(array.length === 0) return 0;

    const restOfArray = array.slice(1);


    return array[0] + slowAdd(restOfArray);

}

const dataArray = [2, 5, 7]
slowAdd(dataArray);


const fastSum = (array)=>{
    return _fastSum(array, 0);
};
const _fastSum = (array, start)=>{
    if(start === array.length) return 0;

    return array[start] + _fastSum(array, start + 1);

}

//console.log(fastSum(dataArray)); 

const binSearch = (array, target)=>{

    //Divide and Conquer which is dividing the problem into smaller pieces usually done by filtering out wiht if statements
    //while executes till you return false;

    //array  = length x while(0 < length - 1 )  element = array[i];
    //target  = single value that we are looking for.


    //target is everthing  all the conditions depend on the target
    //         ...........
    //target is the tester
    // target is less then 5
    // target most be 0, 1, 2, 3, 4

    //target is > then 6
    //every number that is less then 6 is not valid.

    //target needs to be equal to 24
    //target meets one test to be close to 24 not not 24 it's 20
    //every number below 20 is not valid

    //left is fist element of the array
    //right is the last element of the array
    //middle is average of left and right 1, 2 / 2
    //middle changes because it's declared within the while
     //0            Im the last one
    //left and what did right

    //[1, 2, 3, 4, 5, 6, 7 , 8];
    //left <-- mid -->     right
    //Divide

    //left = 0 can they be mututed can they change
    //right = 10 can right change the answer is si
    //O(nLogn)

    //Mutate on if statements  parameter is mutated ...magic
    //A hypotheses followed by a conclusion.
    //left is 0
    //right is 10
    //mid is average of left and right
    //if target binary Search Algorithm 


    let left = 0;
    let right = array.length;

    while (left <= right) {
        let mid  = Math.floor(left + right / 2);
        if(target === array[mid]){
            return console.log(target + ' at index ' + mid);
        }else if(target < array[mid]){
            right = mid - 1;
        }else{
            left = mid + 1;
        }
    }
    return false;

}
//binSearch(nums, 2);

*/

//combination is a collection of items where the order does not matter.
//order does not matter
//left exclusive
//right inclusive


const combinations = (elements) =>{
    if(elements.length === 0) return [[]];
    const firstEl = elements[0];
    const rest = elements.slice(1);
    
    const combsWithOutFirst = combinations(rest);
    const combsWithFirst = [];

    combsWithOutFirst.forEach(comb => {
      const combWithFirst =  [...comb, firstEl];// create a copy and add the first.
      combsWithFirst.push(combWithFirst);
    });

    return [...combsWithOutFirst, ...combsWithFirst];
}

console.log(combinations(['a', 'b', 'c'])); 


