import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('PlatIAgro Dataset Store');
});

module.exports = app;
