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

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    plot: String,
    genres: [String],
    runtime: Number,
    cast: [String],
    num_mflix_comments: Number,
    poster: String,
    title: String,
    fullplot: String,
    languages: [String],
    released: Date,
    directors: [String],
    rated: String,
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    },
    lastupdated: Date,
    year: Number,
    imdb: {
        rating: Number,
        votes: Number,
        id: Number
    },
    countries: [String],
    type: String,
    tomatoes: {
        viewer: {
            rating: Number,
            numReviews: Number,
            meter: Number
        },
        dvd: Date,
        lastUpdated: Date
    }
}
);

module.exports = class MoviesDB {
    constructor() {
        // We don't have a `Movie` object until initialize() is complete
        this.Movie = null;
    }

    // Pass the connection string to `initialize()`
    initialize(connectionString) {
        return new Promise((resolve, reject) => {
            const db = mongoose.createConnection(
                connectionString,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
            );

            db.once('error', (err) => {
                reject(err);
            });
            db.once('open', () => {
                this.Movie = db.model("movies", movieSchema);
                resolve();
            });
        });
    }

    async addNewMovie(data) {
        const newMovie = new this.Movie(data);
        await newMovie.save();
        return newMovie;
    }

    getAllMovies(page, perPage, title) {
        let findBy = title ? { title } : {};

        if (+page && +perPage) {
            return this.Movie.find(findBy).sort({ year: +1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
        }

        return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
    }

    getMovieById(id) {
        return this.Movie.findOne({ _id: id }).exec();
    }

    updateMovieById(data, id) {
        return this.Movie.updateOne({ _id: id }, { $set: data }).exec();
    }

    deleteMovieById(id) {
        return this.Movie.deleteOne({ _id: id }).exec();
    }
}
