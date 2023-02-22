const path = require("path")
const ForkTsCheckerWebpackPlugin = require( 'fork-ts-checker-webpack-plugin' )

module.exports = {
    mode: "development",
    entry: "./dist-ts/index.js",
    devtool: "source-map",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public"),
    },
    resolve: {
        fallback: {
            fs: false,
            path: false
        },
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@assets": path.resolve(__dirname, "public/assets"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@type": path.resolve(__dirname, "src/@types")
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        host: "0.0.0.0",
        allowedHosts: 'all',
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
    ]
}
