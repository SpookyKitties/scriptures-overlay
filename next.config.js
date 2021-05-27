// next.config.js
const withPlugins = require('next-compose-plugins');
const withSass = require('@zeit/next-sass');
const nextPwa = require('next-pwa');
const withCSS = require('@zeit/next-css');
// module.exports = withSass({
//   /* config options here */
// });

module.exports = withPlugins([
  withSass({}),
  withCSS({}),
  nextPwa({
    pwa: {
      dest: 'public',
      mode: 'production'
    },
  }),
]);
