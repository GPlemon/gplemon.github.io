/* 
Components of a JWT

A JWT is made up of three components:

    Header
    Payload
    Signature



*/

// -----------------------------------------------------

//JWT Header

//A JWT header contains the type of the token we’re creating and the signing algorithm that will be used. 

/* 
Type: The type of this token will always be “JWT”.
The Internet Assigned Numbers Authority, or IANA, coordinates internet protocol resources across the globe.
The “JWT” type aligns with the media type “application/jwt“. 
*/

/* 
Algorithm: The signing, or hashing, algorithm used might vary. Some commonly used algorithms are HMAC-SHA256,
represented by "HS256",
RSA with SHA-256,
represented by "RW256",
and ECDSA with SHA-256,
represented by "ES256".

e.g

{
  'alg': 'HS256',  
  'typ': 'JWT'
}
*/

//JWT Payload

/* 
Registered Claims: These are predefined claim types that anyone can use in a JWT.
*/

/* 
Public Claims: These are custom claim types that are created by a developer and can be used publicly.
 They should be registered to avoid collisions, also known as repeated claims.
*/

/* 
Private Claims: These are custom claim types that are not registered or public.
 They are only used between parties that have agreed to use them. 
*/
/* 
e.g.
{
 'sub': '1234567890',
 'name': 'Harine Cooper',
 'admin': false,
 'iat': 1620924478,
 'exp': 1620939187
}
*/

//JWT Signature: A JWT signature is used to verify that the JWT wasn’t tampered with or changed. 
/* 
The Base64Url encoding of our header is:

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

The Base64Url encoding of our payload is:

eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhhcmluZSBDb29wZXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTYyMDkyNDQ3OCwiZXhwIjoxNjIwOTM5MTg3fQ

Finally, we use the HMAC-SHA256 algorithm we defined in our header to create our signature:

HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)

*/


//Do not store your JWT in localStorage as an attacker could use Cross-Site Scripting attacks to steal local data. 
/* 
Storing your JWT in a cookie may seem like a solution to this, but could expose your data to a Cross-Site Resource Forgery attack.
 Additionally, if a user has disabled cookies in their browser, the application is now unable to store the JWT.
*/



/* 
                Properly Storing A JWT

Now that we’ve stored our user’s information in our JWT, what do we do with it? How do we use the information in our JWT when communicating with our server?

   1. The user logs into a website and their information is sent to the server.

   2. The server creates a JWT with a secret

   3. The JWT is returned to the browser

   4. The user makes another request, and the browser sends the JWT back to the server in the Authorization header using the Bearer schema.

   5. With our newly created JWT, this would look like:

   6. Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkhhcmluZSBDb29wZXIiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTYyMDkyNDQ3OCwiZXhwIjoxNjIwOTM5MTg3fQ.3B-FLgPETrExxlDKW30AoU7KGE6xuZodw79TQR8_mwM

   7. The server verifies the JWT signature and gets user information from the JWT.

   8. The server will send a response back to the browser. If the JWT is valid, the browser will receive what it requested, if the JWT was not valid, the browser will likely receive an error message.

An image showing that first, the user logs in, then the server creates a JWT with a secret. Next, the server returns the JWT to the browser. The Browser sends the JWT on the Authorization header. The server verifies the JWT and sends a response to the client.

*/

/* 
Why Use JWTs?
Parsing JSON is easier than some alternatives like XML or SAML.
JWTs are small, scale well, and are easier for mobile devices to process. 
Why are some reasons we might not want to a JWT?
A mix of a public and private key-pair adds security, but can also add complexity.
Sensitive information, like passwords or Social Security Numbers, should not be stored client-side, even if it is encoded. 
*/

//jwt.io

/* 
Node.js JWT Libraries

    jsonwebtoken GitHub repo
    node-jws GitHub repo
    jose GitHub repo

*/