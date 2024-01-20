/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___ANURAG DAS_____ Student ID: __126031228__ Date: ____Jan 19th 2024___
*  Cyclic Link: _______________________________________________________________
*
********************************************************************************/ 


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const MoviesDB = require('./modules/moviesDB.js');

dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 3000;
const db = new MoviesDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Movies API' });
});

// POST /api/movies
app.post('/api/movies', async (req, res, next) => {
  try {
    const newMovie = await db.addNewMovie(req.body);
    res.status(201).json(newMovie);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies
app.get('/api/movies', async (req, res, next) => {
  try {
    const { page, perPage, title } = req.query;
    const movies = await db.getAllMovies(page, perPage, title);
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// GET /api/movies/:id
app.get('/api/movies/:id', async (req, res, next) => {
  try {
    const movie = await db.getMovieById(req.params.id);
    if (!movie) {
      res.status(204).json({ message: 'No Content' });
    } else {
      res.json(movie);
    }
  } catch (err) {
    next(err);
  }
});

// PUT /api/movies/:id
app.put('/api/movies/:id', async (req, res, next) => {
  try {
    const result = await db.updateMovieById(req.body, req.params.id);
    if (result.nModified > 0) {
      res.json({ message: 'Movie updated successfully' });
    } else {
      res.status(204).json({ message: 'No Content' });
    }
  } catch (err) {
    next(err);
  }
});

// DELETE /api/movies/:id
app.delete('/api/movies/:id', async (req, res, next) => {
  try {
    const result = await db.deleteMovieById(req.params.id);
    if (result.deletedCount > 0) {
      res.json({ message: 'Movie deleted successfully' });
    } else {
      res.status(204).json({ message: 'No Content' });
    }
  } catch (err) {
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize MongoDB connection and start the server
(async () => {
  try {
    await db.initialize(process.env.MONGODB_CONN_STRING);
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
