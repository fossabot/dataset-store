import cors from 'cors';
import express from 'express';

import { Dataset, Header, Result } from './routes';

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use('/datasets', Dataset);

app.use('/headers', Header);

app.use('/results', Result);

app.get('/', (req, res) => {
  res.status(200).send('PlatIAgro Dataset Store');
});

module.exports = app;
