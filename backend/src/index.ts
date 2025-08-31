import dotenv from 'dotenv';
dotenv.config();
const app = require('./server');
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';

const PORT = process.env.PORT || 5000;
console.log('Environment check:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Found' : 'Missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'Found' : 'Missing',
  MONGO_URI: process.env.MONGO_URI ? 'Found' : 'Missing'
});
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
