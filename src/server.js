import { PORT } from './config/config';
import app from './app';

const port = PORT;
app.listen(port, () => {
  console.log(`API running on port ${port}!`);
});
