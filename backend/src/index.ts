require('dotenv').config();
const app = require('./server');
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
