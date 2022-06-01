//Set-Cookie: Key=Value; expires=Saturday, 01-May-2021 07:30:10 GMT



//Set-Cookie: Key=Value; expires=Saturday, 01-May-2021 07:30:10 GMT; HTTPOnly   :more secure

//Secure makes sure cookies are only sent with a request to an HTTPS page.
//SameSite helps prevent Cross-Site Request Forgery (CSRF) attacks.


/* 
localStorage is a newer form of client-side storage.
These browser files also store data as key-value pairs,
and web applications can choose to store up to 5MB of data in localStorage.
*/


/* 
sessionStorage,
which uses the same syntax aslocalStorage
,can hold session data.
This storage clears once the browser closes: more secure.

*/

//-----------------------------------------------------

var images = new Map([
    ["lucy", 'https://static-assets.codecademy.com/content/paths/web-security/sessions-cookies/localStorage-exercise/lucy.jpg'],
    ["red", 'https://static-assets.codecademy.com/content/paths/web-security/sessions-cookies/localStorage-exercise/red.jpg'],
    ["maxine", 'https://static-assets.codecademy.com/content/paths/web-security/sessions-cookies/localStorage-exercise/maxine.jpg'],
  ]);
  
  function selectProfile(name){
    if (name != localStorage.getItem('profile')) {
      alert("Now setting character to... " + name)
    }
    // Set the profile in localStorage below:
    localStorage.setItem('profile', name);
  }
  
  function loadProfile(){
    // Set character to the 'profile' value from localStorage
    var character = localStorage.getItem('profile');
  
    if (character) {
      display_character(character)
    }
  }
  
  function display_character(name) {
    var img = document.createElement('img');
    img.src = images.get(name);
    document.getElementById('character').appendChild(img);
  } 
  
  function loadHome(){
    if (localStorage.getItem('profile')) {
      display_character(name)
    }
  }


  /*
Secure Header
  
  expect-ct: max-age=604800,
  report-uri="https://report-uri.com"
  referrer-policy: strict-origin-when-cross-origin
  strict-transport-security: max-age=31536000; includeSubDomains; preload
  x-content-type-options: nosniff
  x-frame-options: DENY
  x-xss-protection: 1; mode=block
  x-permitted-cross-domain-policies: none
  x-frame-options: SAMEORIGIN
  
  
  */