import https from 'https';
import fs from 'fs';
import app from './app.js'; // your Express app

const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

https.createServer(options, app).listen(8443, () => {
  console.log('🔐 HTTPS API running on port 443');
//   connectDBB(); // make sure this is not async here
//   listenToEvents();
});
