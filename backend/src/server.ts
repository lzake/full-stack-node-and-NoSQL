import express from 'express';
import { searchFilms } from './searchService';
import mockServices from './mockServices';

const app = express();
app.use(express.json());

app.post('/search', async (req, res) => {
  try {
    const result = await searchFilms(req.body);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during search:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Unknown error during search');
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});

app.use('/mock/vhs', mockServices);
app.use('/mock/dvd', mockServices);
app.use('/mock/projector', mockServices);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});