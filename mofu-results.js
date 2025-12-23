// mofu-results.js - Results page script
(() => {
  // Wait until the DOM is fully ready
  document.addEventListener('DOMContentLoaded', () => {
    // === Configure these ===
    const logoToken = 'pk_QiQEX6EtQH65grYfT4unYQ'; // your logo.dev token

    // Element IDs on the results page (set these in Webflow)
    const companyNameId = 'company-name'; // ID for element showing company name
    const companyLogoId = 'company-logo'; // ID for <img> element showing logo

    // === Code ===
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const domain = urlParams.get('domain');
    const company = urlParams.get('company');

    // If no domain parameter, redirect back or show error
    if (!domain) {
      console.warn('No domain parameter found in URL');
      // Optionally redirect back to form page
      // window.location.href = '/';
      return;
    }

    // Get elements
    const companyNameEl = document.getElementById(companyNameId);
    const companyLogoEl = document.getElementById(companyLogoId);

    // Update company name
    if (companyNameEl) {
      companyNameEl.textContent = company || domain;
    } else {
      console.warn(`Element with ID "${companyNameId}" not found. Set this ID in Webflow.`);
    }

    // Update logo
    if (companyLogoEl) {
      const logoUrl = `https://img.logo.dev/${encodeURIComponent(
        domain
      )}?token=${encodeURIComponent(logoToken)}`;
      companyLogoEl.setAttribute('src', logoUrl);
      companyLogoEl.setAttribute('alt', `${company || domain} logo`);
      companyLogoEl.style.display = 'block';
    } else {
      console.warn(`Element with ID "${companyLogoId}" not found. Set this ID in Webflow.`);
    }
  });
})();

