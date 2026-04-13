const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === '@react-native-community/netinfo') {
        return {
            filePath: path.resolve(__dirname, 'node_modules/@react-native-community/netinfo/lib/commonjs/index.js'),
            type: 'sourceFile',
        };
    }

    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;