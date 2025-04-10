import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js'; 

const app = express();

// Use either ANY domain or only your Vercel domain, not both:
app.use(cors({
  origin: 'https://box-seat.vercel.app'
}));

app.use(express.json());

// If you have routes, mount them here:
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
