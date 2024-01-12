/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config');

const nextConfig = {
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          {key: 'Access-Control-Allow-Credentials', value: 'true'},
          {key: 'Access-Control-Allow-Origin', value: '*'}, // replace this your actual origin
          {key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT'},
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  env: {
    BAIFA_ADDRESS_IN_ENGLISH: process.env.REACT_APP_BAIFA_ADDRESS_IN_ENGLISH,
    BAIFA_ADDRESS_IN_CHINESE: process.env.REACT_APP_BAIFA_ADDRESS_IN_CHINESE,
    BAIFA_ADDRESS_ON_GOOGLE_MAP: process.env.REACT_APP_BAIFA_ADDRESS_ON_GOOGLE_MAP,
    BAIFA_PHONE_NUMBER: process.env.REACT_APP_BAIFA_PHONE_NUMBER,
    GITHUB_LINK: process.env.REACT_APP_GITHUB_LINK,

    BAIFA_DB_HOST: process.env.REACT_APP_BAIFA_DB_HOST,
    BAIFA_DB_USER: process.env.REACT_APP_BAIFA_DB_USER,
    BAIFA_DB_PORT: process.env.REACT_APP_BAIFA_DB_PORT,
    BAIFA_DB_PASSWORD: process.env.REACT_APP_BAIFA_DB_PASSWORD,
    BAIFA_DB_DATABASE: process.env.REACT_APP_BAIFA_DB_DATABASE,
  },
};

module.exports = nextConfig;
