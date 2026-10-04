const path = require('node:path');

try {
  process.loadEnvFile(path.join(__dirname, '..', '.env'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

function env(key, { required = true } = {}) {
  const value = process.env[key]?.trim();
  if (!value && required) throw new Error(`La variable ${key} est manquante dans le fichier .env`);
  return value || null;
}

module.exports = { env };
