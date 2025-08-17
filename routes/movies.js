const express = require("express");
const movieRouter = express.Router();
const Movie = require("../models/movie");
const xlsx = require("xlsx");
const { handleUploadErrors } = require("../middleware/uploadFile");
const { authMiddleware } = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// Create movie
movieRouter.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { name, rating, genres } = req.body;

      if (!name || !rating) {
        return res
          .status(400)
          .json({
            status: "error",
            message: "Movie name and rating are required",
          });
      }

      const movie = new Movie({
        name,
        rating,
        genres,
        watchedUsers: req.user._id ? [req.user._id] : [],
      });

      await movie.save();

      res.status(201).json({
        status: "success",
        data: movie,
        message: "Movie created successfully",
      });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  }
);

// Bulk upload movies via Excel
movieRouter.post(
  "/bulk-upload",
  authMiddleware,
  roleMiddleware("admin"),
  handleUploadErrors("file"),
  async (req, res) => {
    try {
      if (!req?.file) {
        return res
          .status(400)
          .json({ status: "error", message: "No file uploaded" });
      }

      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!data.length) {
        return res.status(400).json({
          status: "error",
          message: "Excel file is empty or invalid",
        });
      }

      const movies = data.map((row, index) => {
        if (!row.name || !row.rating) {
          throw new Error(
            `Row ${index + 2} is missing required fields (name, rating)`
          );
        }
        return {
          name: row.name,
          rating: row.rating,
          genres: row.genres ? row.genres.split(",") : [],
          watchedUsers: [],
        };
      });

      await Movie.insertMany(movies);

      res.status(201).json({
        status: "success",
        data: movies,
        message: "Movies uploaded successfully",
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);

// Get movies with filters + pagination
movieRouter.get(
  "/moviesList",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { genre, rating, page = 1, limit = 10 } = req.query;

      let filter = {};
      if (genre) filter.genres = genre;
      if (rating) filter.rating = { $gte: Number(rating) };

      const movies = await Movie.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Movie.countDocuments(filter);

      res.json({
        status: "success",
        data: movies,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }
);

module.exports = movieRouter;
