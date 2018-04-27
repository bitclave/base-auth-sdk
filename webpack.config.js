const path = require('path');

module.exports = (env) => (
    {
        entry: './src/sdk.js',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'sdk.js',
            library: 'BASEAuthSDK',
            libraryTarget: 'umd2',
            umdNamedDefine: true,
        },
        resolve: {
            alias: {
                settings: path.join(__dirname, 'src', 'settings', `${env}`),
            }
        },
    }
)
