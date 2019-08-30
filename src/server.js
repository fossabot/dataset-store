import { PORT } from './config/config';
import app from './app';

const port = PORT;
app.listen(port, () => {
  console.log(`Running on port ${port}!`);
});
