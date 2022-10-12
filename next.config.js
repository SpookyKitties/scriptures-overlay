// next.config.js
const withPlugins = require('next-compose-plugins');
const nextPwa = require('next-pwa');
// const withCSS = require('@zeit/next-css');
// module.exports = withSass({
//   /* config options here */
// });

// module.exports = withPlugins([
//   nextPwa({
//     pwa: {
//       dest: 'public',
//       mode: 'production',
//     },
//   }),
// ]);

module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/gen/1',
        permanent: true,
      },
    ];
  },
};
