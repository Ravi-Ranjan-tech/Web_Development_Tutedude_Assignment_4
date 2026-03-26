// Minimal submit handler using native HTML5 validation
const form = document.getElementById('signup-form');
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()){
    // Let the browser show validation UI; don't override
    return;
  }
  e.preventDefault();
  // Simple confirmation (no extra UI)
  alert('Form submitted successfully');
  form.reset();
});
