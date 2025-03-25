import express from 'express';
import cors from 'cors';

const app = express();

// If you want to allow requests from *any* domain:
app.use(cors());

// If you want to allow only your Vercel domain:
app.use(cors({
  origin: 'https://box-seat.vercel.app'
}));

app.use(express.json());

// ... your routes, e.g.
// app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
