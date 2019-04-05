const Path = require('path');
const Webpack = require('webpack');

module.exports = (env) => (
    {
        entry: './src/sdk.js',
        output: {
            path: Path.join(__dirname, 'dist'),
            filename: 'BASEAuthSDK.js',
            library: 'BASEAuthSDK',
            libraryTarget: 'umd2',
            umdNamedDefine: true,
        },
        resolve: {
            alias: {
                settings: Path.join(__dirname, 'src', 'settings', `${env}`),
            }
        },
        plugins: [
            new Webpack.DefinePlugin({
                'process.env': {
                    WIDGET_URL: JSON.stringify(process.env.WIDGET_URL),
                    WIDGET_LOCATION: JSON.stringify(process.env.WIDGET_LOCATION),
                }
            })
        ]
    }
);
