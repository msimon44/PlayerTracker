const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Prevent Metro from traversing PNPM placeholder folders that can throw EACCES on Windows.
config.resolver.blockList = exclusionList([
    /[/\\]node_modules[/\\]\.pnpm[/\\].*[/\\]node_modules[/\\]\.ignored_.*/,
    /[/\\]\.ignored_.*/,
]);

module.exports = config;
