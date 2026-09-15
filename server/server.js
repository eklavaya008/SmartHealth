const { NODE_ENV, PORT } = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} [${NODE_ENV}]`);
});
