// const envPath = `${process.cwd()}src/.env`;
// console.log(envPath)
// dotenv.config({
//   path: envPath
// });

export default {
  port: process.env.PORT,
  url: process.env.REACT_APP_FCC_URL || 'http://localhost:8888',
  ws: process.env.REACT_APP_FCC_WS || 'ws://localhost:8888',
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || "pk.eyJ1Ijoicml2a2F0IiwiYSI6ImNqd3lydGl4dDE4bmk0OW41N3p2bWdtbDUifQ.XFStSB9_uqA1Ldqb8W8bzw"
};