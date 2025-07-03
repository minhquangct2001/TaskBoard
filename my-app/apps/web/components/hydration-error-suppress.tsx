'use client';

import { useEffect } from 'react';

export function HydrationErrorSuppress() {
  useEffect(() => {
    // Only suppress in development
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      
      console.error = (...args) => {
        // Filter out hydration warnings caused by browser extensions
        const message = args[0];
        if (
          typeof message === 'string' && 
          (
            message.includes('Hydration failed because the server rendered HTML didn\'t match the client') ||
            message.includes('bis_skin_checked') ||
            message.includes('bis_register') ||
            message.includes('__processed_') ||
            message.includes('Text content does not match server-rendered HTML')
          )
        ) {
          return; // Suppress these specific warnings
        }
        originalError.apply(console, args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  return null;
}
