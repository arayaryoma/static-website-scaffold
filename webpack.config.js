const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const yaml = require("js-yaml");
const fs = require("fs");
const PRODUCTION = process.env.NODE_ENV === "production";

const languages = {
  ja: yaml.safeLoad(fs.readFileSync("./src/assets/i18n/ja.yml"), "utf8")
};

const defaultLang = "ja";

const internationalize = lang => {
  return nestedKey => {
    let local = languages[lang];
    const keys = nestedKey.replace(/^\./, "").split(".");
    for (let i = 0, length = keys.length; i < length; ++i) {
      const key = keys[i];
      if (!(key in local)) {
        return nestedKey;
      }
      local = local[key];
    }
    return local;
  };
};

function config(lang) {
  return {
    entry: ["babel-polyfill", "./src/scripts/index.js"],
    resolve: {
      extensions: [".js", ".json"]
    },
    output: {
      path: path.join(__dirname, "dist", lang === defaultLang ? "" : lang),
      filename:
        lang === defaultLang ? "[name].[hash].js" : `[name]-${lang}.[hash].js`
    },
    plugins: [
      new HtmlPlugin({
        template: "src/templates/index.pug",
        filename: "index.html",
        i18n: internationalize(lang)
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new OptimizeCSSAssetsPlugin({}),
      new CopyWebpackPlugin([
        {
          from: "public/*",
          to: ""
        }
      ])
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["babel-preset-env"]
            }
          }
        },
        {
          test: /\.(styl)$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true
              }
            },
            {
              loader: "stylus-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },

        {
          test: /\.(png|jpg|ico|svg|gif|woff|woff2|ttf|eot)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "assets/[name]-[hash].[ext]"
              }
            }
          ]
        },
        {
          test: /\.pug$/,
          use: [
            {
              loader: "pug-loader"
            }
          ]
        }
      ]
    },
    devServer: {
      contentBase: path.resolve(__dirname, "dist"),
      port: 4000
    }
  };
}

module.exports = Object.keys(languages).map(lang => {
  return config(lang);
});
