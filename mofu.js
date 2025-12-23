// domain-check.js
(() => {
  // Wait until the DOM is fully ready (important if this script is loaded in the page head)
  document.addEventListener('DOMContentLoaded', () => {
    // === Configure these ===
    const apiKey = 'AIzaSyBnk67LXHprS-fmJAQ0Piv8zKZx5fo_rfY';
    const sheetId = '1cUbwtE-ZoyBRLvikceoo_qg0dRrsPnZe28edvOIBaAk';
    const tabName = 'Sheet1';

    // IDs from your Webflow form
    // Webflow automatically prefixes form IDs with "wf-form-"
    // based on the form name "domain-form".
    const formId = 'wf-form-domain-form';
    const inputId = 'domain-input';
    const buttonId = 'domain-submit';

    // Logo.dev configuration (for showing company logos)
    const logoToken = 'pk_QiQEX6EtQH65grYfT4unYQ'; // replace with your actual token if needed
    const logoImgId = 'company-logo'; // ID of the <img> element in Webflow

    // === Code ===
    let form = document.getElementById(formId);
    let input = document.getElementById(inputId);
    let button = document.getElementById(buttonId);
    const logoImg = document.getElementById(logoImgId);

    console.log('Domain checker: looking for elements', {
      form: !!form,
      input: !!input,
      button: !!button,
    });

    // Fallback: try to auto-detect the form and fields if IDs are not set correctly
    if (!form || !input || !button) {
      console.warn(
        'Domain checker: form/input/button not found by ID. Attempting auto-detect. For best reliability, set IDs in Webflow (form: domain-form, input: domain-input, button: domain-submit).'
      );

      // Try to find a form that looks like the domain form
      form =
        form ||
        document.querySelector('form[data-name*="domain" i]') ||
        document.querySelector('form');

      if (form) {
        // Try to find a text input that looks like the domain input
        input =
          input ||
          form.querySelector('input[name*="domain" i]') ||
          form.querySelector('input[type="text"], input[type="email"], input');

        // Try to find the submit button
        button =
          button ||
          form.querySelector('button[type="submit"], input[type="submit"], .w-button');
      }

      console.log('Domain checker: auto-detected elements', {
        formDetected: !!form,
        inputDetected: !!input,
        buttonDetected: !!button,
        formElement: form,
        inputElement: input,
        buttonElement: button,
      });

      if (!form || !input || !button) {
        console.warn(
          'Domain checker: auto-detect also failed. Please ensure the domain form is on this page and that element IDs are set correctly in Webflow.'
        );
        return;
      }
    }

    let cache = null;
    async function loadSheet() {
      if (cache) return cache;
      const range = encodeURIComponent(`${tabName}!A:B`);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Sheets API error ${res.status}`);
      const data = await res.json();
      const rows = data.values || [];
      const map = new Map();
      for (let i = 1; i < rows.length; i++) {
        const domain = String(rows[i][0] || '').trim().toLowerCase();
        const company = rows[i][1] || '';
        if (domain) map.set(domain, company);
      }
      cache = map;
      return map;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const domain = (input.value || '').trim().toLowerCase();
      if (!domain) {
        alert('Please enter a domain.');
        return;
      }

      // Clear / hide logo before each check
      if (logoImg) {
        logoImg.style.display = 'none';
        logoImg.removeAttribute('src');
        logoImg.setAttribute('alt', '');
      }

      button.disabled = true;
      try {
        const map = await loadSheet();
        if (map.has(domain)) {
          const company = map.get(domain);
          alert(`Match found! Company: ${company}`);

          // If we have a logo image element, update it to show the logo for the domain
          if (logoImg) {
            const logoUrl = `https://img.logo.dev/${encodeURIComponent(
              domain
            )}?token=${encodeURIComponent(logoToken)}`;
            logoImg.setAttribute('src', logoUrl);
            logoImg.setAttribute('alt', `${company || domain} logo`);
            logoImg.style.display = 'block';
          }
        } else {
          alert('No match found.');
        }
      } catch (err) {
        console.error(err);
        alert('Error checking the sheet. Please try again.');
      } finally {
        button.disabled = false;
      }
    });
  });
})();