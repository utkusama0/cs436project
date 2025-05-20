export function getEnv(name, defaultValue) {
  return import.meta.env[name] || defaultValue;
}

export const API_BASE = import.meta.env.VITE_API_BASE || '/api'; 