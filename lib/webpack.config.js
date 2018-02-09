const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const yaml = require('js-yaml');
const fs = require('fs');

const languages = {
  "ja": yaml.safeLoad(fs.readFileSync('./src/assets/i18n/ja.yml'), 'utf8'),
};

const defaultLang = 'ja';

function config(lang) {
  return {
    entry: ['babel-polyfill', './src/scripts/index.js'],
    resolve: {
      extensions: ['.js', '.json'],
    },
    output: {
      path: path.join(__dirname, 'dist', (lang === defaultLang ? '' : lang)),
      filename: lang === defaultLang ? '[name].[hash].js' : `[name]-${lang}.[hash].js`,
    },
    plugins: [
      new HtmlPlugin({
        template: 'src/templates/index.html',
      }),
      new ExtractTextPlugin("styles.css"),
      new I18nPlugin(
        languages[lang], {
          nested: true
        }
      ),
      new CopyWebpackPlugin([{
        from: 'public/*',
        to: '',
      }])
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['babel-preset-env']
            }
          }
        },
        {
          test: /\.(styl)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              },
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: true
                }
              },
            ]
          })
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          })

        },
        {
          test: /\.(png|jpg|ico|svg|woff|woff2|ttf|eot)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[name]-[hash].[ext]',
              }
            }
          ],
        }
      ]
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      port: 4000
    }
  };
}

module.exports = Object.keys(languages).map((lang) => {
  return config(lang);
});
