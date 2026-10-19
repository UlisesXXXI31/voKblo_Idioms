const registrationScript = document.currentScript;

if (!registrationScript) {
  throw new Error('No se pudo determinar la ruta de registro del Service Worker.');
}

const appRoot = new URL('../../', registrationScript.src);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('service-worker.js', appRoot).href, {
      scope: appRoot.pathname
    }).then(registration => {
      console.log('✅ SW registrado correctamente con scope:', registration.scope);
    }).catch(error => {
      console.error('❌ Error registrando SW:', error);
    });
  });
} else {
  console.warn('❌ Service Worker no soportado en este navegador');
}
