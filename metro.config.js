// Permet d'embarquer la base SQLite (.db) comme asset.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('db');

// Aperçu web uniquement : le module AdMob est natif, on le remplace par un module qui échoue (géré par pubs.ts).
const resolveParDefaut = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-google-mobile-ads') {
    return { type: 'sourceFile', filePath: path.join(__dirname, 'tools', 'module-absent.js') };
  }
  return (resolveParDefaut ?? context.resolveRequest)(context, moduleName, platform);
};

// Aperçu web : expo-sqlite (WebAssembly) a besoin de SharedArrayBuffer, donc de l'isolation cross-origin.
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  return middleware(req, res, next);
};

module.exports = config;
