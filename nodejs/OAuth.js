//Client Credentials OAuth 2.0 flow

//Resource Owner: the user who authorizes an application to an account
//Resource Server: the API server that accepts access tokens and verifies their validity
//Authorization Server: the server that issues access tokens
//Client: the application that requests the access tokens

//Installing oauth2-server
//npm install --save oauth2-server
const OAuth2Server = require('oauth2-server'); // For access, store, and validate our access tokens.
//const oauth = new OAuth2Server();
//
//We’ll be writing them separately in a file named model.js. 
const oauth = new OAuth2Server({
model: require('./model.js'),
allowBearerTokensInQueryString: true,//To pass tokens inside the URL
accessTokenLifetime: 60 * 60 //Set Token lifetime to 1 hour
})

const authenticateRequest = (req, res, next) => {
 
    let request = new OAuth2Server.Request(req);
    let response = new OAuth2Server.Response(res);
   
    return oauth.authenticate(request, response)
      .then(()=>{
        next();
      })
      .catch((err) => {
        res.send('You are not allowed')
      })
  }
  
//Registering Client to Application
//OAuth defines two types of clients — confidential clients and public clients. 
//Public clients are NOT able to store credentials securely and can only use grant types that do not use their client secret.
//Confidential clients are applications that can be registered to an authorization server using credentials.

//When a developer registers a client in an OAuth application, they’ll need:

//We can register an application to the list of confidentialClients in db.js. 
//db.js is a file that contains the confidentialClients objects array.

//app.js
// Write obtainToken() here
const obtainToken = (req, res) => {
    let request = new OAuth2Server.Request(req);
    let response = new OAuth2Server.Response(res);
    return oauth.token(request, response)
      .then((token) => {
        res.json(token);
      })
      .catch((err) => {
        res.json(err);
      })
  }
  
  // Write '/auth' route here
  app.all('/auth', obtainToken);
    // Add authenticateRequest as middleware to '/secret' here
    app.get('/secret', authenticateRequest, (req, res)=>{
        res.send('Welcome to the secret area.');
    })

//db.js
module.exports = {
    // Add confidential clients[]
    confidentialClients: [{
      clientId: 'codecademy',
      clientSecret:'codec@demy',
      grants: [
        'client_credentials'
      ]
    }],
    // Add tokens[]
    tokens: []
  }

//model.js
let db = require('./db.js');

const getClient = (clientId, clientSecret) => {
  let confidentialClients = db.confidentialClients.filter((client) => {
    return client.clientId === clientId && client.clientSecret === clientSecret
  });
  return confidentialClients[0];
}

const saveToken = (token, client, user) => {
  token.client = {
    id: client.clientId
  }
  token.user = {
    username: user.username
  }
  db.tokens.push(token);
  return token;
}

const getUserFromClient = (client) => {
  return {}
}

// Write getAccessToken() function here

const getAccessToken = (accessToken) => {
  let tokens = db.tokens.filter((savedToken)=>{
    return savedToken.accessToken === accessToken;
  })
  return tokens[0];
}


// Export getAccessToken() function here
module.exports = {
  getClient: getClient,
  saveTokens: saveToken,
  getUserFromClient: getUserFromClient,
  getAccessToken: getAccessToken
}

//sample_database.js

module.exports = {
    confidentialClients: [{
      clientId: 'secretapplication',
      clientSecret:'topsecret',
      grants: [
        'client_credentials'
      ]
    }],
    tokens: []
  }


//getClient() is a function that returns the client object from the database. <https://oauth2-server.readthedocs.io/en/latest/model/spec.html#model-getclient>
//The saveToken() function must be implemented for all grant types in the model used by OAuth2Server.Stores the access token as an object to a database when an access token is obtained.

