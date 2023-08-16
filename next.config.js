/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  env: {
    BAIFA_ADDRESS_IN_ENGLISH: process.env.REACT_APP_BAIFA_ADDRESS_IN_ENGLISH,
    BAIFA_ADDRESS_IN_CHINESE: process.env.REACT_APP_BAIFA_ADDRESS_IN_CHINESE,
    BAIFA_ADDRESS_ON_GOOGLE_MAP: process.env.REACT_APP_BAIFA_ADDRESS_ON_GOOGLE_MAP,
    BAIFA_PHONE_NUMBER: process.env.REACT_APP_BAIFA_PHONE_NUMBER,
    GITHUB_LINK: process.env.REACT_APP_GITHUB_LINK,
  },
};

module.exports = nextConfig;
