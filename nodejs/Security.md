# Encryption

Hashing
Encoding
Obfuscation

There are two main types of encryption: symmetric and asymmetric.

- Symmetric encryption uses the same key to both encrypt and decrypt data.
- Asymmetric encryption uses two different keys to encrypt and decrypt data.

## Symmetric Encryption

Symmetric encryption is the fastest way to encrypt data, and the most common for sending large chunks of data, however, it has one major vulnerability: if you send someone your key, then it’s in a form that any other person can read. That means your data is vulnerable to being stolen.

## Asymmetric Encryption

The public key can be given to anyone and is only used to encrypt data.
The private key is kept secret and is only used to decrypt data.

## Hashing

Hashing does not encrypt data.
Instead, hashing is a one-way process that takes a piece of data of any size and uses a mathematical function to represent that data with a unique hash value of a fixed size. You cannot compute the original data from its hash.

## Using Hashes to Protect Data

Hashes are widely used in order to store passwords in online databases.
For example, let’s suppose a user’s password is:

CodecademyIsGr8t

Now, if the website storing the password is using a SHA-256 hash, even if someone hacked into that website, all the hacker would see is the hash value:

d04f855e71ad9d495d91e666175d593b669f45970f885a258f6dbbaab262ac8b

## Encoding

Encoding transforms data into a form that can be used by a different type of system.

- ASCII (American Standard Code for Information Interchange)
- Unicode
- Base64

Encoded information is easily reversed and only requires knowledge of the algorithm used to decode information.

## Obfuscation

Obfuscation is less about data security and more about securing code.

`
Authentication and authorization go hand in hand. Users must be authenticated before carrying out the activity they are authorized to perform. Security is strong when the means of authentication cannot later be refuted—the user cannot later deny that [they] performed the activity. This is known as non-repudiation.
`

<http://www.passportjs.org/>

### Authorization Code Grant

The webserver must have the capability to store client credentials securely.

### Proof Key for Code Exchange (PKCE)

PKCE is an extension to the Authorization Code flow, and it is used to prevent attacks and to securely perform the OAuth exchange from public clients.

### Threats to OAuth

Even if an attacker were to obtain the access tokens, the usually short-lived nature of the access tokens means an attacker would not be able to do much with them.

### Hashing Implementation

import `bcrypt`

`

## Create password hashing function

const passwordHash = async (password, saltRounds) => {
  try{
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }catch(err){
   console.log(err);
  }
 return null
};

## Verifying Passwords function

const comparePasswords = async (password, hash) => {
  try {
    const matchFound = await bcrypt.compare(password, hash);
    return matchFound;
  } catch (err) {
    console.log(err);
  }
  return false;
};

## Bcrypt in a CRUD App

`


