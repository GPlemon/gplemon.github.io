// Import the express library
import express from 'express';
// Instantiate the app
const app = express();

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//route example
app.get('/expressions', (req, res, next) => {
  
});

//-----------------------------------------------------


// Serves Express Yourself website
app.use(express.static('public'));

const { getElementById, seedElements } = require('./utils');

const expressions = [];
seedElements(expressions, 'expressions');


// Use static server to serve the Express Yourself Website
app.use(express.static('public'));

app.get('/expressions', (req, res, next) => {
  res.send(expressions);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



//Getting A Single Expression

//Routes become much more powerful when they can be used dynamically. Express servers provide this functionality with named route parameters. Parameters are route path segments that begin with : in their Express route definitions. They act as wildcards, matching any text at that path segment. For example /monsters/:id will match both/monsters/1 and /monsters/45.

//Express parses any parameters, extracts their actual values, and attaches them as an object to the request object: req.params. This object’s keys are any parameter names in the route, and each key’s value is the actual value of that field per request.

const monsters = { 
  hydra: { height: 3, age: 4 }, 
  dragon: { height: 200, age: 350 } 
};
// GET /monsters/hydra
app.get('/monsters/:name', (req, res, next) => {
  console.log(req.params); // { name: 'hydra' }
  res.send(monsters[req.params.name]);
});

//In this code snippet, a .get() route is defined to match /monsters/:name path. When a GET request arrives for /monsters/hydra, the callback is called. Inside the callback, req.params is an object with the key name and the value hydra, which was present in the actual request path.

//The appropriate monster is retrieved by name (the object key) from the monsters object and sent back to the client with res.send().

//-----------------------------------------------------

//Setting Status Codes
//e.g res.send() has by default sent a 200 OK status code. 

const monsterStoreInventory = { fenrirs: 4, banshees: 1, jerseyDevils: 4, krakens: 3 };
app.get('/monsters-inventory/:name', (req, res, next) => {
  const monsterInventory = monsterStoreInventory[req.params.name];
  if (monsterInventory) {
    res.send(monsterInventory);
  } else {
    res.status(404).send('Monster not found');
  }
});

//-----------------------------------------------------
// Matching Longer Paths
//Route parameters will match anything in their specific part of the path, so a route matching /monsters/:name would match all the following request paths:

/* /monsters/hydra
/monsters/jörmungandr
/monsters/manticore
/monsters/123 */


//-----------------------------------------------------

//Other HTTP Methods
//Express provides methods for each one: app.put(), app.post(), and app.delete().

//-----------------------------------------------------


// PUT /monsters/1?name=chimera&age=1
app.put('/monsters/:id', (req, res, next) => {
  const monsterUpdates = req.query;
  monsters[req.params.id] = monsterUpdates;
  res.send(monsters[req.params.id]);
});

app.put('/expressions/:id', (req, res, next) => {
    const expressionIndex = getIndexById(req.params.id, expressions);
    if (expressionIndex !== -1) {
      updateElement(req.params.id, req.query, expressions);
      res.send(expressions[expressionIndex]);
    } else {
      res.status(404).send();
    }
  });
//-----------------------------------------------------
//Matching By HTTP Verb
/* 
//use Put to update a resource
when you use a PUT request, the server will look for a resource with the specified ID and update it with the new data.
*/

//-----------------------------------------------------
//POST is the HTTP method verb used for creating new resources.

app.post('/expressions', (req, res, next) => {
    const receivedExpression = createElement('expressions', req.query);
    if (receivedExpression) {
      expressions.push(receivedExpression);
      res.status(201).send(receivedExpression);
    } else {
      res.status(400).send();
    }
  });

  //-----------------------------------------------------
    //DELETE is the HTTP method verb used for deleting resources.
    app.delete('/expressions/:id', (req, res, next) => {
        const expressionIndex = getIndexById(req.params.id, expressions);
        if (expressionIndex !== -1) {
          expressions.splice(expressionIndex, 1);
          res.status(204).send();
        } else {
          res.status(404).send();
        }
      });


//-----------------------------------------------------
//CRUD Operations
// Get all animals

app.get('/animals', (req, res, next) => {
    res.send(animals);
  });
  
  // Get a single animal
  app.get('/animals/:id', (req, res, next) => {
    const animal = getElementById(req.params.id, animals);
    if (animal) {
      res.send(animal);
    } else {
      res.status(404).send();
    }
  });
  
  // Create an animal
  app.post('/animals', (req, res, next) => {
    const receivedAnimal = createElement('animals', req.query);
    if (receivedAnimal) {
      animals.push(receivedAnimal);
      res.status(201).send(receivedAnimal);
    } else {
      res.status(400).send();
    }
  });
  
  // Update an animal
  app.put('/animals/:id', (req, res, next) => {
    const animalIndex = getIndexById(req.params.id, animals);
    if (animalIndex !== -1) {
      updateElement(req.params.id, req.query, animals);
      res.send(animals[animalIndex]);
    } else {
      res.status(404).send();
    }
  });
  
  // Delete a single animal
  app.delete('/animals/:id', (req, res, next) => {
    const animalIndex = getIndexById(req.params.id, animals);
    if (animalIndex !== -1) {
      animals.splice(animalIndex, 1);
      res.status(204).send();
    } else {
      res.status(404).send();
    }
  });

  //-----------------------------------------------------
  //Routing to a module with express.Router() more information at https://expressjs.com/en/guide/routing.html
  const monstersRouter = express.Router();
 
    app.use('/monsters', monstersRouter);
    
    monstersRouter.get('/:id', (req, res, next) => {
    const monster = monsters[req.params.id];
    if (monster) {
        res.send(monster);
    } else {
        res.status(404).send();
    }
    });
    
    /* 
    
    GET /expressions/:id
    PUT /expressions/:id
    POST /expressions
    DELETE /expressions/:id

    
    */

    //Postman is an API testing environment.
    //cURL is a command line tool for transfering data via URLs.
    //https://www.taniarascia.com/making-api-requests-postman-curl/
    //http://expressjs.com/en/api.html#req.params
    //http://expressjs.com/en/api.html#req.query