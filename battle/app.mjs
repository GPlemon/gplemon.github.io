
// Readable Streams
/* 
One of the simplest uses of streams is reading and writing to files line-by-line.
 To read files line-by-line, we can use the .createInterface()
  method from the readline core module. .createInterface()
   returns an EventEmitter set up to emit 'line' events:
*/
//object factory










class Human {
  constructor(name, strength){
    this._name = name
    this._health = 100
    this._strength = strength
  }

  get health(){
    return this._health
  }

}

class Male extends Human{
  constructor(name, strength){
    super(name, strength)
    
    this._relations = []
  }

  status(){
    return console.log(`Person ${this._name} has ${this._health} health and ${this._strength} strength`)
  }

  get relations(){
    return this._relations
  }
}

let man = new Male('John Doe', 10)
let man2 = new Male('James Johnson', 23)

function dual(male, male2){
  while(male._health >= 0){
    male._health -= male2._strength
    male2._health -= male._strength
  }
  male.status()
  male2.status()

  if(male._health > male2._health){
    return console.log(male._name)
  }else if(male2._health > male._health){
    return console.log(male2._name)
  }
  return console.log('Tie')
}

dual(man, man2)






