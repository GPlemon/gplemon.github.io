// Readable Streams
/* 
One of the simplest uses of streams is reading and writing to files line-by-line.
 To read files line-by-line, we can use the .createInterface()
  method from the readline core module. .createInterface()
   returns an EventEmitter set up to emit 'line' events:
*/
//object factory
const human = (name, age) => {
    return {
        name,
        age,
        greet() {
            console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
        }
    }
}

const man = human('John', 50)

const keys = Object.keys(man)
console.log(keys); 




const higherOrderFunction = (param) => {
    param()

}

const humans = (_name, _age, _gender) => {
    return {_name,
    _age,
    _gender,
    yell(){
        return 'Ahh'
        }
    }
}


//git checkout HEAD filename - Discards changes made
//git reset HEAD filename - Unstages file changes in the staging area.
//git reset commit_SHA - Resets to a previous commit.
//Something here