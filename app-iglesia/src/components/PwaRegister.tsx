'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    // 1. Registro multi-navegador del Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('PWA SW activo:', reg.scope))
          .catch((err) => console.error('Error cargando PWA SW:', err));
      });
    }

    // 2. Captura del evento de instalación para Chromium/Opera/Brave
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Guardar el evento globalmente si deseas mostrar un botón personalizado de instalación en la App
      (window as unknown as { deferredPrompt?: Event }).deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  return null;
}