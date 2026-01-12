const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

// Get default entries (auto-detected blocks)
// Note: defaultConfig.entry might be an object or function
const getEntry = () => {
    if (typeof defaultConfig.entry === 'function') {
        return defaultConfig.entry();
    }
    return defaultConfig.entry;
};

module.exports = {
    ...defaultConfig,
    entry: {
        ...getEntry(),
        index: path.resolve(process.cwd(), 'src', 'index.js'),
    },
};
