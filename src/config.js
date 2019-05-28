import dotenv from 'dotenv'

// const envPath = `${process.cwd()}src/.env`;
// console.log(envPath)
// dotenv.config({
//   path: envPath
// });

export default {
  port: process.env.PORT,
  url: process.env.REACT_APP_FCC_URL || 'http://localhost:8888',
  ws: process.env.REACT_APP_FCC_WS || 'ws://localhost:8888'
};