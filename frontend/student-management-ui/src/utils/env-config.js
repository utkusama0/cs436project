// src/utils/env-config.js

// 1) Read the K8s‐injected config (env.js)
const RUNTIME_CFG = window.__APP_CONFIG__ || {};

/**
 * Returns the value of the given key, preferring the runtime override.
 * @param {string} name     – Vite env var name, e.g. 'VITE_API_BASE'
 * @param {any}    fallback – value to use if neither runtime nor build-time exists
 */
export function getEnv(name, fallback) {
  if (RUNTIME_CFG[name] != null) {
    return RUNTIME_CFG[name];
  }
  return import.meta.env[name] || fallback;
}

// 2) Our single source of truth for all fetches
export const API_BASE = getEnv('VITE_API_BASE', '/api');
