import express from 'express';

const router = express.Router();

const mockFilms = [
  {
    title: "Psycho",
    releaseYear: 1960,
    numberOfCopiesAvailable: 5,
    director: "Alfred Hitchcock",
    distributor: "Paramount Pictures"
  },
  {
    title: "Avengers: Endgame",
    releaseYear: 2019,
    numberOfCopiesAvailable: 10,
    director: "Anthony Russo, Joe Russo",
    distributor: "Marvel Studios"
  }
];

router.post('/search', (req, res) => {
  res.json(mockFilms);
});

export default router;