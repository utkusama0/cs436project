// src/utils/env-config.js

// 1) Read the K8s‐injected config (env.js)
const RUNTIME_CFG = window.__APP_CONFIG__ || {};

// Debug: Log the runtime config
console.log('Runtime config loaded:', RUNTIME_CFG);

/**
 * Returns the value of the given key, preferring the runtime override.
 * @param {string} name     – Vite env var name, e.g. 'VITE_API_BASE'
 * @param {any}    fallback – value to use if neither runtime nor build-time exists
 */
export function getEnv(name, fallback) {
  const configValue = RUNTIME_CFG[name];
  const envValue = import.meta.env[name];
  const result = configValue != null ? configValue : (envValue || fallback);
  
  // Debug: Log each environment variable retrieval
  console.log(`ENV ${name}:`, { 
    runtimeValue: configValue, 
    buildTimeValue: envValue, 
    fallback, 
    result 
  });
  
  return result;
}

// 2) Our single source of truth for all fetches
export const API_BASE = getEnv('VITE_API_BASE', '/api');
console.log('Final API_BASE:', API_BASE);
