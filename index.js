import express from 'express';
import cors from 'cors';
import { getLogs, listenToEvents } from './eventListener.js';
import { connectDB } from './models/ConnectDb.js';


const app = express();
app.use(cors());
app.use(express.json());


// app.get('/api/trades', (req, res) => {
//   res.json(getLogs());
// });
app.get('/api/trades', async (req, res) => {
  try {
    const logs = await getLogs(); // ✅ wait for logs
    res.json(logs);
  } catch (err) {
    console.error("❌ Failed to fetch logs:", err.message);
    res.status(500).json({ error: "Failed to fetch trade logs" });
  }
});

(async () => {
  try {
    await connectDB();               // connect MongoDB
    listenToEvents();                 // start listening to contract events

    app.listen(process.env.PORT || 5001, () => {
      console.log(`🚀 API running on port ${process.env.PORT || 5001}`);
    });
  } catch (err) {
    console.error("❌ Failed to start app:", err.message);
    process.exit(1); // Exit process on startup failure
  }
})();

// app.listen(process.env.PORT || 5001, () => {
//   console.log(`API running on port ${process.env.PORT || 5001}`);
//   await connectDB();
//   listenToEvents();
// });

// export default app;