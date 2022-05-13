
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

  async attempt(self, target){
    console.log(`${self._name} is attempting ${target._name}`)
    const result = await attempting(self, target)
    console.log(result)
  }

}

function attempting(self,target){
  return new Promise((resolve, reject)=>{
    
    setTimeout(()=>{
      if(self._strength > target._strength){
       return resolve(`${self._name} wins`)
      }else{
        self._health -= target._strength / 2
       return  resolve(`${target._name} wins`)
      }
    }, 1000)

  })
}




let man = new Male('John Doe', 10)
let man2 = new Male('James Johnson', 23)
//man.attempt(man, man2)


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




//dual(man, man2)

function isZero(num){
  return new Promise((resolve, reject)=>{
    if(num === 0){
      resolve('zero')
    }else{
      resolve('not zero')
    }
  })
}

//isZero(23).then((value)=> console.log(value))



const list = []
let f  =0;

let promise = new Promise((resolve, reject)=>{
  resolve('success')
  console.log('promise resolved')
  ++f 
})
let promise1 = new Promise((resolve, reject)=>{
  resolve('success 1')

})
let promise2 = new Promise((resolve, reject)=>{
  resolve('success 2')
  ++f 
})


const consumer = async () => {
  const result = await Promise.all([promise, promise1, promise2])
  console.log('result: ', result)
  console.log('f: ', f)
}

consumer()


