//count certs as promise resolved
let counter = 0

async function cert(cid = '', path = '') {
    let uuid = crypto.randomUUID()
    let template = `
    <tr id="${uuid}">
        <embed class="pdf item" src="${ path }"  height="275">
    </tr>
    `
    document.getElementById('cert-app').innerHTML += template


    return;
}


cert('', 'data/UdacityCertificate.pdf')
cert('', 'data/CertificateOfCompletion_Advanced Node.js.pdf')
cert('', 'data/CertificateOfCompletion_CSS Essential Training.pdf')
cert('', 'data/CertificateOfCompletion_EndtoEnd JavaScript Testing with Cypress.io.pdf')
cert('', 'data/CertificateOfCompletion_Ethical Hacking with JavaScript.pdf')
cert('', 'data/CertificateOfCompletion_JavaScript Best Practices for Code Formatting.pdf')
cert('', 'data/CertificateOfCompletion_JavaScript Best Practices for Data.pdf')
cert('', 'data/CertificateOfCompletion_JavaScript Security Essentials.pdf')
cert('', 'data/CertificateOfCompletion_JavaScript TestDriven Development ES6.pdf')
cert('', 'data/CertificateOfCompletion_Learning MongoDB.pdf')
cert('', 'data/CertificateOfCompletion_Master JavaScript.pdf')
cert('', 'data/CertificateOfCompletion_Node.js Design Patterns.pdf')
cert('', 'data/CertificateOfCompletion_Responsive Layout.pdf')
cert('', 'data/Gabrielius Pocevicius_JavaScript.pdf')
cert('', 'data/Gabrielius Pocevicius_Python.pdf')