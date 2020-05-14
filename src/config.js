// const envPath = `${process.cwd()}src/.env`;
// console.log(envPath)
// dotenv.config({
//   path: envPath
// });

export default {
  port: process.env.PORT,
  url: process.env.REACT_APP_FCC_URL || 'http://trialgraph-ingress.argos.192.116.82.79.xip.io',
  ws: process.env.REACT_APP_FCC_WS || 'ws://trialgraph-ingress.argos.192.116.82.79.xip.io',
  mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1Ijoicml2a2F0IiwiYSI6ImNqd3lydGl4dDE4bmk0OW41N3p2bWdtbDUifQ.XFStSB9_uqA1Ldqb8W8bzw',
};
