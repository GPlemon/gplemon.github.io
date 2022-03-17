const fib = (n) => {
    if (n <= 2) return 1
    return fib(n - 1) + fib(n - 2)
}


//a = [1,2,3,4]
// b = [3, 4, 5, 6]


const sym = (...args) => {

    let result = []
    let first = args[0]
    let next = args[1]

    for (let i = 0; i < first.length; i++) {
        let a = first[i]
        console.log('A', a, '->')
        for (let j = 0; j < next.length; j++) {
            let b = next[j]
            console.log('B', b)
            if (a === b) {
                console.log('same shit ', a);
            } else {
                result.push(a)
            }
        }
    }

    console.log('result: ', result);
}

//sym([1, 2, 3], [5, 2, 1, 4])

//a & b = [3, 4, 5]
//hoisting



const A = [1, 2, 3, 4, 5, 6, 7, 8];
const B = [1, 3, 5, 6, 7, 8, 9];


//const diff = [2, 4, 9]

const symmetricDifference = (arr1, arr2) => {
    const res = [];
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) !== -1) {
            continue;
        }
        res.push(arr1[i]);
    }
    for (let i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) !== -1) {
            continue;
        }
        res.push(arr2[i]);
    }
    return res;
};



//console.log(symmetricDifference(A, B));

function func(...arg) {
    let result = []
    let list = []
    for (let i = 0; i < arg.length; i++) {
        list.push(arg[i])
    }


    for (let i = 0; i < list[0].length; i++) {
        if (list[1].indexOf(list[0][i]) !== -1) {
            continue;
        }
        result.push(list[0][i]);
    }

    for (let i = 0; i < list[1].length; i++) {
        if (list[0].indexOf(list[1][i]) !== -1) {
            continue;
        }
        result.push(list[1][i]);
    }
    return console.log(result)

}

func([1, 2, 3, 4, 5, 6, 7, 8], [1, 3, 5, 6, 7, 8, 9])