var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

module.exports = {
    context: __dirname,
    entry: {
        main: './assets/js/index',
        css: './assets/css/index',
        scheduler: './assets/js/scheduler/teacher/index.jsx',
        selection_slot: './assets/js/scheduler/student/select/index.jsx',
        scheduler_student: './assets/js/scheduler/student/view/index.jsx',
    },
    devServer: {
        contentBase: path.resolve(__dirname),
        inline: true,
        hot: false,
        quiet: true,
        stats: {
            colors: true
        }
    },
    output: {
        path: path.resolve('./assets/bundles/'),
        filename: "[name]-[hash].js",
        publicPath: 'http://localhost:3000/assets/bundles/'
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new BundleTracker({filename: './webpack-stats.json'}),
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        })
    ],

    module: {
        loaders: [
            {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, loaders: ['style-loader', 'css-loader']},
            {
                test: require.resolve("jquery"),
                loader: "expose-loader?$"
            },
            {
                test: require.resolve("moment"),
                loader: "expose-loader?moment"
            },
            {
                test: require.resolve("jquery"),
                loader: "expose-loader?jQuery"
            },
        ],
    },

    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },
}