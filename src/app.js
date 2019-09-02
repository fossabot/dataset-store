import cors from 'cors';
import express from 'express';

import routes from './routes';
import middlewares from './middlewares';

const app = express();

app.use(cors());

app.use(function bucket(req, res, next) {
  middlewares.bucketVerify();
  next();
});

// Routes
app.use('/file', routes.file);

app.get('/', (req, res) => {
  res.status(200).send('PlatIAgro Dataset Store');
});

module.exports = app;
