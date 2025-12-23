// domain-check.js
(() => {
  // Wait until the DOM is fully ready (important if this script is loaded in the page head)
  document.addEventListener('DOMContentLoaded', () => {
    // === Configure these ===
    const apiKey = 'AIzaSyBnk67LXHprS-fmJAQ0Piv8zKZx5fo_rfY';
    const sheetId = '1cUbwtE-ZoyBRLvikceoo_qg0dRrsPnZe28edvOIBaAk';
    const tabName = 'Sheet1';

    // IDs from your Webflow form
    const formId = 'domain-form';
    const inputId = 'domain-input';
    const buttonId = 'domain-submit';

    // === Code ===
    const form = document.getElementById(formId);
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    console.log('Domain checker: looking for elements', {
      form: !!form,
      input: !!input,
      button: !!button,
    });

    if (!form || !input || !button) {
      console.warn(
        'Domain checker: form/input/button not found. Check element IDs in Webflow (form: domain-form, input: domain-input, button: domain-submit).'
      );
      return;
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

      button.disabled = true;
      try {
        const map = await loadSheet();
        if (map.has(domain)) {
          alert(`Match found! Company: ${map.get(domain)}`);
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