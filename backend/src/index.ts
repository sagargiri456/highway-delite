require('dotenv').config();
const app = require('./server');
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
