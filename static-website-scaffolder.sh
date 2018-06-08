#!/bin/bash

if ! command -v npm; then
  echo "npm is required to run the script"
  exit 1
fi

npm init -y
devDependencies="
babel-core
babel-loader
babel-polyfill
babel-preset-env
cache-loader
copy-webpack-plugin
file-loader
html-loader
pug
pug-loader
html-webpack-plugin
mini-css-extract-plugin
optimize-css-assets-webpack-plugin
js-yaml
rimraf
stylus
stylus-loader
style-loader
css-loader
webpack
webpack-cli
webpack-dev-server
husky
prettier
pretty-quick
"

npm install --save-dev $devDependencies

dependencies="
normalize.css
"

npm install --save $dependencies

mkdir -p src/styles
mkdir -p src/scripts
mkdir -p src/templates
mkdir -p src/assets/i18n
mkdir -p src/assets/images
mkdir -p src/assets/fonts
mkdir -p public

curl -L -s "https://www.gitignore.io/api/macos,linux,node" > .gitignore

curl -L -s "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/src/templates/index.pug" > src/templates/index.pug

curl -L -s "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/src/scripts/index.js" > src/scripts/index.js

curl -L -s "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/src/styles/main.styl" > src/styles/main.styl

curl -L -s "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/src/styles/fonts.styl" > src/styles/fonts.styl

curl -L -s "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/webpack.config.js" > webpack.config.js

curl -L -s "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/src/assets/i18n/ja.yml" > src/assets/i18n/ja.yml

curl -L -s "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/.editorconfig" > .editorconfig

curl -o src/assets/images/michelle.gif "https://raw.githubusercontent.com/Allajah/static-website-scaffold/master/src/assets/images/michelle.gif"


npm install add-npm-scripts
./node_modules/.bin/add-npm-scripts start "webpack-dev-server --mode development"
./node_modules/.bin/add-npm-scripts start:prd "NODE_ENV=production webpack-dev-server --mode production"
./node_modules/.bin/add-npm-scripts build "rimraf dist && NODE_ENV=production webpack --mode production"
./node_modules/.bin/add-npm-scripts precommit "pretty-quick --staged"
npm uninstall add-npm-scripts
