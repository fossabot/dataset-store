import cors from 'cors';
import express from 'express';

import routes from './routes';

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use('/datasets', routes.Dataset);

app.get('/', (req, res) => {
  res.status(200).send('PlatIAgro Dataset Store');
});

module.exports = app;
