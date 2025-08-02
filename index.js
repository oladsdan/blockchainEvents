import https from 'https';
import fs from 'fs';
import app from './app.js'; // your Express app
import { connectDB } from './models/ConnectDb.js';
import { listenToEvents } from './eventListener.js';

const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

// https.createServer(options, app).listen(8443, () => {
//   console.log('🔐 HTTPS API running on port 443');
// //   connectDBB(); // make sure this is not async here
// //   listenToEvents();
// });

const PORT = 7070;

(async () => {
  try {
    await connectDB();      // Connect MongoDB
    listenToEvents();       // Start event listeners

    https.createServer(options, app).listen(PORT, () => {
      console.log(`🔐 HTTPS API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
})();
