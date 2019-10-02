import cors from 'cors';
import express from 'express';

import { Dataset, Header } from './routes';

const app = express();

app.use(cors());

// Routes
app.use('/datasets', Dataset);

app.use('/headers', Header);

app.get('/', (req, res) => {
  res.status(200).send('PlatIAgro Dataset Store');
});

module.exports = app;
