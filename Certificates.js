document.addEventListener("DOMContentLoaded", function() {
  // Check if we've already loaded certificates to prevent duplicates
  if (window.certificatesLoaded) return;
  window.certificatesLoaded = true;
  
  // Certificate data with more metadata for better display
  const certificates = [
    { path: 'data/UdacityCertificate.pdf', title: 'Udacity Certificate', category: 'education' },
    { path: 'data/Coursera E4WZRUCIBAMB.pdf', title: 'Coursera Certificate', category: 'education' },
    { path: 'data/CertificateOfCompletion_Master JavaScript.pdf', title: 'Master JavaScript', category: 'javascript' },
    { path: 'data/CertificateOfCompletion_Career Essentials in Generative AI by Microsoft and LinkedIn.pdf', title: 'Generative AI Essentials', category: 'ai' },
    { path: 'data/CertificateOfCompletion_Advanced Node.js.pdf', title: 'Advanced Node.js', category: 'node' },
    { path: 'data/CertificateOfCompletion_CSS Essential Training.pdf', title: 'CSS Essential Training', category: 'css' },
    { path: 'data/CertificateOfCompletion_EndtoEnd JavaScript Testing with Cypress.io.pdf', title: 'Cypress.io Testing', category: 'javascript' },
    { path: 'data/CertificateOfCompletion_Ethical Hacking with JavaScript.pdf', title: 'Ethical Hacking', category: 'javascript' },
    { path: 'data/CertificateOfCompletion_JavaScript Best Practices for Code Formatting.pdf', title: 'JS Code Formatting', category: 'javascript' },
    { path: 'data/CertificateOfCompletion_JavaScript Best Practices for Data.pdf', title: 'JS Data Practices', category: 'javascript' },
    { path: 'data/CertificateOfCompletion_JavaScript Security Essentials.pdf', title: 'JS Security', category: 'javascript' },
    { path: 'data/CertificateOfCompletion_JavaScript TestDriven Development ES6.pdf', title: 'Test-Driven Development', category: 'javascript' },
    { path: 'data/CertificateOfCompletion_Learning MongoDB.pdf', title: 'MongoDB', category: 'database' },
    { path: 'data/CertificateOfCompletion_Node.js Design Patterns.pdf', title: 'Node.js Design Patterns', category: 'node' },
    { path: 'data/CertificateOfCompletion_Responsive Layout.pdf', title: 'Responsive Layout', category: 'css' },
    { path: 'data/Gabrielius Pocevicius_JavaScript.pdf', title: 'JavaScript Certificate', category: 'javascript' },
    { path: 'data/Gabrielius Pocevicius_Python.pdf', title: 'Python Certificate', category: 'python' },
    { path: 'data/CertificateOfCompletion_Search Techniques for Web Developers.pdf', title: 'Search Techniques', category: 'development' },
    { path: 'data/CertificateOfCompletion_Essential New Skills in Software Engineering.pdf', title: 'Software Engineering Skills', category: 'development' },
  ];

  let loadedCount = 0;
  const totalCerts = certificates.length;
  const certContainer = document.getElementById('cert-container');
  const loadingIndicator = document.getElementById('loading-indicator');
  
  // Clear existing certificates to prevent duplicates
  if (certContainer) {
    certContainer.innerHTML = '';
  }
  
  // Update loading progress
  function updateProgress() {
    loadedCount++;
    const progress = Math.round((loadedCount / totalCerts) * 100);
    
    if (loadingIndicator) {
      loadingIndicator.style.width = `${progress}%`;
      loadingIndicator.setAttribute('aria-valuenow', progress);
      loadingIndicator.textContent = `${progress}%`;
    }
    
    if (loadedCount === totalCerts) {
      // Hide loading bar when complete
      setTimeout(() => {
        const loadingWrapper = document.getElementById('loading-wrapper');
        if (loadingWrapper) {
          loadingWrapper.classList.add('opacity-0', 'h-0', 'mb-0');
        }
      }, 500);
    }
  }

  // Create certificate card with Tailwind classes
  function createCertificateCard(cert) {
    return new Promise((resolve) => {
      const uuid = crypto.randomUUID();
      const card = document.createElement('div');
      card.className = 'cert-card opacity-0 transform translate-y-4 transition-all duration-300 ease-in-out data-category-' + cert.category;
      card.dataset.categories = cert.category;
      card.id = uuid;
      
      // Add a staggered animation effect
      setTimeout(() => {
        card.classList.remove('opacity-0', 'translate-y-4');
      }, loadedCount * 100);
      
      card.innerHTML = `
        <div class="bg-card text-card-foreground rounded-lg shadow-sm overflow-hidden">
          <div class="relative h-64 border overflow-hidden">
          <iframe class="relative h-full overflow-hidden pointer-events-none border-0" src="${cert.path}"></iframe>

            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent transform translate-y-full transition-transform duration-300 p-4 flex flex-col justify-end">
              <div class="text-white font-medium text-sm">${cert.title}</div>
            </div>
          </div>
          <div class="p-4 bg-card">
            <div class="flex justify-between items-center m-2">
              <span class="text-xs text-muted-foreground">${cert.category}</span>
              <a href="${cert.path}" target="_blank" class="badge border px-2 py-1 rounded-0 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-secondary/90 h-8">
                View Full
              </a>
            </div>
          </div>
        </div>
      `;

      if (certContainer) {
        certContainer.appendChild(card);
      }
      
      // Simulate loading time
      setTimeout(() => {
        updateProgress();
        resolve();
      }, 100);
      
      // Add hover effect
      card.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.bg-gradient-to-t');
        if (overlay) overlay.classList.remove('translate-y-full');
      });
      
      card.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.bg-gradient-to-t');
        if (overlay) overlay.classList.add('translate-y-full');
      });
    });
  }

  // Load all certificates
  async function loadAllCertificates() {
    if (!certContainer) return;
    
    const loadPromises = certificates.map(cert => createCertificateCard(cert));
    await Promise.all(loadPromises);
  }

  // Initialize
  loadAllCertificates();
});