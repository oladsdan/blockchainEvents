import express from 'express';
import cors from 'cors';
import { listenToEvents, getLogs } from './eventListener.js';

const app = express();
app.use(cors());
app.use(express.json());

let botStatus = 'Idle';

app.get('/api/trades', (req, res) => {
  res.json(getLogs());
});

app.get('/api/status', (req, res) => {
  res.json({
    botStatus,
    lastUpdated: Date.now(),
  });
});


app.listen(process.env.PORT || 5001, () => {
  console.log(`🚀 API running on port ${process.env.PORT || 5001}`);
  listenToEvents();
});